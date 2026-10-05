import {spawn} from 'node:child_process';
import {writeFile,readFile,unlink} from 'node:fs/promises';
const root=new URL('../',import.meta.url).pathname,paths=['lib/news-snapshot.json','lib/news-issues.json','lib/news-coverage.json','lib/newsroom-status.json'],backups=new Map();let committed=false;
async function command(program,args,{capture=false}={}){return new Promise((resolve,reject)=>{const child=spawn(program,args,{cwd:root,stdio:['ignore',capture?'pipe':'inherit','inherit']});let output='';if(capture)child.stdout.on('data',d=>output+=d);child.on('error',reject);child.on('exit',code=>code===0?resolve(output.trim()):reject(new Error(program+' failed')));});}
try{
 if(await command('git',['status','--porcelain'],{capture:true}))throw new Error('Working tree has pending changes; preserve them and stop');
 if(await command('git',['branch','--show-current'],{capture:true})!=='gus/initial-prototype')throw new Error('Unexpected branch');
 await command('git',['pull','--ff-only','origin','gus/initial-prototype']);
 for(const path of [...paths,'.newsroom/editor-ledger.json'])backups.set(path,await readFile(root+path).catch(()=>null));
 await command('node',['scripts/collect-news-records.mjs']);
 await command('node',['scripts/run-newsroom.mjs']);
 await command('npm',['run','build:pages']);
 await writeFile(root+'lib/newsroom-status.json',JSON.stringify({lastAttempt:new Date().toISOString(),status:'ok',lastSuccess:new Date().toISOString()},null,2)+'\n');
 await command('git',['add',...paths]);
 if(await command('git',['diff','--cached','--name-only'],{capture:true})){await command('git',['commit','-m','Publish reviewed weekly Matchstick stories and project updates']);committed=true;try{await command('git',['push','origin','HEAD:gus/initial-prototype']);}catch{try{await command('git',['pull','--rebase','origin','gus/initial-prototype']);}catch{await command('git',['rebase','--abort']).catch(()=>{});throw new Error('Remote changes prevented publication; local commit preserved');}await command('git',['push','origin','HEAD:gus/initial-prototype']);}}
 console.log('Reviewed newsroom snapshot pushed. GitHub Pages handles deployment.');
}catch(error){if(!committed)for(const [path,data] of backups){if(data)await writeFile(root+path,data);else await unlink(root+path).catch(()=>{});}console.error(error.message);process.exitCode=1;}
