import {load} from 'cheerio';
const host='https://mainstreetwadsworth.org',owner='Main Street Wadsworth';
const clean=s=>s.replace(/\s+/g,' ').trim(),plain=html=>{const $=load(String(html||''));$('script,style,iframe,svg,.tribe-events-schedule,.tribe-block').remove();return clean($('body').text());};
export async function mainStreetCalendar({now,easternStamp,tile,dateFormat,timeFormat}){
 const start=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now),end=new Date(now.getTime()+90*86400000).toISOString().slice(0,10),endpoint=host+'/wp-json/tribe/events/v1/events',records=[];let totalPages=1;
 for(let page=1;page<=totalPages;page++){
  const url=new URL(endpoint);for(const [k,v] of Object.entries({start_date:start,end_date:end,per_page:'50',page:String(page)}))url.searchParams.set(k,v);
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw new Error('Main Street event feed HTTP '+response.status);const body=await response.text();if(body.length>3000000)throw new Error('Main Street feed exceeds size limit');const data=JSON.parse(body);if(!Array.isArray(data.events)||!Number.isInteger(data.total_pages)||data.total_pages>8)throw new Error('Main Street event pagination changed');totalPages=data.total_pages;
  for(const event of data.events){if(event.status!=='publish'||event.hide_from_listings)continue;const source=new URL(event.url);if(source.origin!==host||!source.pathname.startsWith('/event/'))throw new Error('Unexpected Main Street event source');if(event.timezone!=='America/New_York')throw new Error('Unsupported Main Street timezone');const date=easternStamp(event.start_date.replace(' ','T')),endDate=easternStamp(event.end_date.replace(' ','T')),title=plain(event.title),description=plain(event.description).split(' ').slice(0,80).join(' '),meeting=/\bcommittee meeting\b/i.test(title)&&/open to the public/i.test(description);if(!title||endDate<date)throw new Error('Invalid Main Street event identity or date');
   records.push({id:'mainstreet-'+event.id,...tile(date),title,time:dateFormat.format(new Date(date))+(event.all_day?' · All day':', '+timeFormat.format(new Date(date))+' – '+timeFormat.format(new Date(endDate))),place:[plain(event.venue?.venue),plain(event.venue?.address),plain(event.venue?.city)].filter(Boolean).join(' · '),type:meeting?'Community meetings':'Around town',calendarCategory:meeting?'Main Street public meetings':'Main Street community events',date,endDate,allDay:Boolean(event.all_day),url:source.href,feedUrl:endpoint,description,sourceOwner:owner});
  }
 }
 return {records,coverage:{title:'Main Street Wadsworth events',url:host+'/events/',status:'ok',records:records.length,checkedAt:now.toISOString()}};
}
