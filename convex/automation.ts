import { internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import * as cheerio from 'cheerio/slim';
const calendarUrl='https://www.wadsworthcity.com/Calendar.aspx';
export const collectCalendar=internalAction({args:{},returns:v.object({state:v.string(),count:v.number()}),handler:async(ctx):Promise<{state:string;count:number}>=>{
 const startedAt=Date.now();try{
 const response=await fetch(calendarUrl,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);
 const html=await response.text();if(html.length>1500000)throw new Error('Page exceeds collection limit');
 const $=cheerio.load(html),events:{eventKey:string;title:string;startLocal:string;location:string;url:string;sourceUrl:string;seenAt:number;active:boolean}[]=[];
 $('[itemtype="http://schema.org/Event"]').each((i,node)=>{
 const title=$(node).find('[itemprop="name"]').first().text().trim();const startLocal=$(node).find('[itemprop="startDate"]').text().trim();const location=$(node).find('[itemprop="location"] [itemprop="name"]').first().text().trim();const href=$(node).closest('li').find('h3 a').attr('href');
 if(!title||!location||!href||!/Calendar\.aspx\?EID=\d+/.test(href)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(startLocal))return;
 const url=new URL(href,calendarUrl);if(url.hostname!=='www.wadsworthcity.com')return;const eventKey=url.searchParams.get('EID');if(!eventKey)return;
 events.push({eventKey,title:title.slice(0,250),startLocal,location:location.slice(0,250),url:url.toString(),sourceUrl:calendarUrl,seenAt:Date.now(),active:true});
 });
 if(events.length===0)throw new Error('Calendar structure missing or empty; zero events not accepted');if(events.length>100)throw new Error('Calendar exceeds bounded import size');
 const dates=events.map(e=>e.startLocal.slice(0,7));if(new Set(dates).size!==1)throw new Error('Unexpected mixed reporting months');
 const expectedMonth=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(Date.now()).slice(0,7);if(dates[0]!==expectedMonth)throw new Error('Calendar reporting month is stale or unexpected');
 $('script,style').remove();const text=$('body').text().replace(/\s+/g,' ').trim();const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));const hash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');
 await ctx.runMutation(internal.collectors.persist,{url:calendarUrl,title:'City calendar',text:text.slice(0,250000),hash,startedAt});
 await ctx.runMutation(internal.issues.importEvents,{events,month:dates[0]});return {state:'success',count:events.length};
 }catch(e){await ctx.runMutation(internal.collectors.persist,{url:calendarUrl,title:'City calendar',text:'',hash:'',startedAt,error:String(e).slice(0,300)});return {state:'failed',count:0};}
}});
export const daily=internalAction({args:{},returns:v.object({calendar:v.string(),events:v.number()}),handler:async(ctx):Promise<{calendar:string;events:number}>=>{await ctx.runAction(internal.collectors.refresh,{});const result=await ctx.runAction(internal.automation.collectCalendar,{});return {calendar:result.state,events:result.count};}});
export const weekly=internalAction({args:{},returns:v.string(),handler:async(ctx):Promise<string>=>{await ctx.runAction(internal.automation.daily,{});return await ctx.runMutation(internal.issues.assemble,{});}});
