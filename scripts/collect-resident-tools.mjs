import {readFile,writeFile} from 'node:fs/promises';
import {load} from 'cheerio';
const root=new URL('../lib/',import.meta.url);
const now=new Date().toISOString();
const clean=s=>s.replace(/\s+/g,' ').trim();
async function collect(file,url,parse){
 let prior;try{prior=JSON.parse(await readFile(new URL(file,root),'utf8'));}catch{}
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Matchstick Wadsworth public-service source collector'}});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const html=await response.text();if(html.length>3000000)throw new Error('Record exceeds collection limit');
  const result=await parse(load(html));
  await writeFile(new URL(file,root),JSON.stringify({...result,sourceUrl:url,collectedAt:now,lastAttempt:now,status:'ok'},null,2)+'\n');
  console.log(`${file}: ${result.records.length} records`);
 }catch(error){
  if(!prior)throw error;
  await writeFile(new URL(file,root),JSON.stringify({...prior,lastAttempt:now,status:'stale',error:String(error.message)},null,2)+'\n');
  console.error(`${file}: retained last successful snapshot (${error.message})`);
 }
}
const reportDate=d=>`${String(d.getUTCMonth()+1).padStart(2,'0')}/${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCFullYear()).slice(-2)}`;
const permitReport=new URL('https://building.medinaco.org/permits/permitList.php');permitReport.searchParams.set('code','C');permitReport.searchParams.set('sDate',reportDate(new Date(Date.now()-90*86400000)));permitReport.searchParams.set('eDate',reportDate(new Date()));
await collect('permit-snapshot.json',permitReport.href,($)=>{
 const period=$('body').text().match(/From (\d{2}\/\d{2}\/\d{2}) through (\d{2}\/\d{2}\/\d{2})/);
 if(!period||!$('body').text().includes('Commercial Permits Issued'))throw new Error('Permit report shape changed');
 const iso=s=>`20${s.slice(6)}-${s.slice(0,2)}-${s.slice(3,5)}`;
 const records=new Map();let section='';let rows=0;
 $('tr').each((_,row)=>{
  const cells=$(row).children('td');
  if(cells.length===1){const t=clean(cells.text());if(/^(Building|Electrical|HVAC) Permits:/.test(t))section=t.split(' ')[0];return;}
  if(cells.length!==6)return;
  const parts=i=>$(cells[i]).html()?.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,'').split('\n').map(s=>clean(load('<p>'+s+'</p>').text())).filter(Boolean)||[];
  const date=parts(0),id=parts(1),site=parts(2);
  if(!/^C-\d+-\d+$/.test(id[0]||''))return;
  rows++;
  if(site.at(-1)!=='WADSWORTH CITY')return;
  if(!/^\d{2}\/\d{2}\/\d{2}$/.test(date[0])||site.length<3)throw new Error('Malformed city permit');
  const issued=iso(date[0]);if(issued<iso(period[1])||issued>iso(period[2]))throw new Error('Permit outside report period');
  const entry={id:id[0],parcel:id[1]||'',issued,address:site[1],type:site[0],discipline:section,value:Number((date[1]||'0').replace(/[^\d.]/g,'')),work:[section]};
  const existing=records.get(entry.id);
  if(existing){if(existing.address!==entry.address)throw new Error('Conflicting permit locations');existing.work=[...new Set([...existing.work,section])];}
  else records.set(entry.id,entry);
 });
 if(!rows)throw new Error('No parsable county permit rows; refusing empty replacement');
 return {periodStart:iso(period[1]),periodEnd:iso(period[2]),records:[...records.values()].sort((a,b)=>b.issued.localeCompare(a.issued))};
});
async function stateBills($,person,chamber,base){
 const heading=$('h2').filter((_,e)=>clean($(e).text())==='Primary Sponsored Bills').first();
 const table=heading.nextAll('table').first();const records=[];
 table.find('tr').each((_,tr)=>{const cells=$(tr).children('th,td');if(cells.length!==2)return;const bill=clean(cells.eq(0).text()),title=clean(cells.eq(1).text()),href=cells.eq(0).find('a').attr('href');if(!/^[SH]\. B\. No\. \d+$/.test(bill)||!title||!href)return;const url=new URL(href,base).href;if(!['www.legislature.ohio.gov','legislature.ohio.gov','www.ohiosenate.gov','www.ohiohouse.gov'].includes(new URL(url).hostname))throw new Error('Unexpected bill source');records.push({bill,title,url,representative:person,role:'Primary sponsor'});});
 if(!records.length){if(chamber==='House'&&$('h1').text().includes(person+' Legislation')&&$('.search-results-empty-container').length)return {representative:person,assembly:'136th General Assembly',records};throw new Error('Legislation table shape changed');}
 for(const record of records){const response=await fetch(record.url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error('Bill page '+response.status);const detail=load(await response.text());const current=detail('h2').filter((_,e)=>clean(detail(e).text())==='Current Version').first().next('p').find('a').first();record.version=clean(current.text());if(!record.version)throw new Error('Missing bill version');record.completedSteps=detail('.status-step').filter((_,e)=>detail(e).find('img[alt="Step completed"]').length>0).map((_,e)=>{const c=detail(e).closest('.status-diagram-house').length?'House':detail(e).closest('.status-diagram-senate').length?'Senate':'';const step=clean(detail(e).text());return /Reported By Committee/.test(step)?c+' committee reported the bill':step;}).get();if(!record.completedSteps.includes('Introduced In '+chamber))throw new Error('Missing introduction marker');const final=detail('.status-diagram-final').first();if(!final.find('img[alt="Final step completed"],img[alt="Final step not completed"]').length)throw new Error('Missing final marker');record.finalStage={label:clean(final.text()),completed:final.find('img[alt="Final step completed"]').length>0};const order=['Introduced In '+chamber,'In '+chamber+' Committee',chamber+' committee reported the bill','Passed By '+chamber,'Introduced In '+(chamber==='House'?'Senate':'House'),'In '+(chamber==='House'?'Senate':'House')+' Committee',(chamber==='House'?'Senate':'House')+' committee reported the bill','Passed By '+(chamber==='House'?'Senate':'House')];record.completedSteps.sort((a,b)=>order.indexOf(a)-order.indexOf(b));}
 return {representative:person,assembly:'136th General Assembly',records};
}
await collect('legislation-snapshot.json','https://www.ohiosenate.gov/members/mark-romanchuk/legislation',$=>stateBills($,'Mark Romanchuk','Senate','https://www.ohiosenate.gov'));
await collect('hutson-legislation-snapshot.json','https://www.ohiohouse.gov/members/sean-hutson/legislation',$=>stateBills($,'Sean Hutson','House','https://www.ohiohouse.gov'));
