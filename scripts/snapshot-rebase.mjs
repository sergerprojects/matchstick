import {writeFile} from 'node:fs/promises';
const allowed=new Set(['lib/federal-legislation-snapshot.json','lib/hutson-legislation-snapshot.json','lib/legislation-snapshot.json','lib/permit-snapshot.json']);
const freshnessKeys=new Set(['collectedAt','lastAttempt']);
function substantive(value){
 if(Array.isArray(value))return value.map(substantive);
 if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(k=>!freshnessKeys.has(k)).map(k=>[k,substantive(value[k])]));
 return value;
}
function refreshedAt(snapshot){
 const groups=Array.isArray(snapshot.groups)?snapshot.groups:[snapshot];
 if(!groups.length||groups.some(g=>g.status!=='ok'))throw new Error('Snapshot recovery requires successful official retrievals');
 const dates=groups.map(g=>Date.parse(g.collectedAt));
 if(dates.some(d=>!Number.isFinite(d)||d>Date.now()+300000||Date.now()-d>2*86400000))throw new Error('Snapshot recovery date is missing, future or stale');
 return Math.min(...dates);
}
// During rebase, stage 2 is upstream and stage 3 is the approved local release.
// Resolve only timestamp-only differences in these four official tool snapshots.
export async function reconcileSnapshotRebase({root,command}){
 const files=(await command('git',['diff','--name-only','--diff-filter=U'],{capture:true})).split('\n').filter(Boolean);
 if(!files.length||files.some(f=>!allowed.has(f)))throw new Error('Conflict requires manual review; approved story files cannot be reconciled here');
 const resolved=[];
 for(const file of files){
  const upstream=JSON.parse(await command('git',['show',':2:'+file],{capture:true}));
  const release=JSON.parse(await command('git',['show',':3:'+file],{capture:true}));
  if(JSON.stringify(substantive(upstream))!==JSON.stringify(substantive(release)))throw new Error('Official records differ; preserve release for manual review');
  const newer=refreshedAt(upstream)>refreshedAt(release)?upstream:release;
  resolved.push({file,text:JSON.stringify(newer,null,2)+'\n'});
 }
 for(const {file,text} of resolved)await writeFile(root+file,text);
 await command('git',['add',...files]);
 await command('git',['-c','core.editor=true','rebase','--continue']);
 console.log('Recovered timestamp-only official snapshot race; approved reporting is unchanged.');
}
