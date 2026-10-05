import { internalMutation, query } from './_generated/server';
import { v } from 'convex/values';
const eventFields={eventKey:v.string(),title:v.string(),startLocal:v.string(),location:v.string(),url:v.string(),sourceUrl:v.string(),seenAt:v.number(),active:v.boolean()};
const issueFields={slug:v.string(),cutoff:v.string(),through:v.string(),generatedAt:v.number(),version:v.number(),body:v.string(),coverage:v.array(v.string())};
export const importEvents=internalMutation({args:{events:v.array(v.object(eventFields)),month:v.string()},returns:v.number(),handler:async(ctx,{events,month})=>{
 if(events.length>100||!/^\d{4}-\d{2}$/.test(month))throw new Error('Invalid bounded calendar import');
 for(const event of events){const old=await ctx.db.query('calendarEvents').withIndex('by_eventKey',q=>q.eq('eventKey',event.eventKey)).unique();if(old)await ctx.db.patch(old._id,event);else await ctx.db.insert('calendarEvents',event);}
 const existing=await ctx.db.query('calendarEvents').withIndex('by_active_and_startLocal',q=>q.eq('active',true).gte('startLocal',month+'-01').lt('startLocal',month+'-32')).take(101);if(existing.length>100)throw new Error('Calendar requires pagination');
 const keys=new Set(events.map(e=>e.eventKey));for(const old of existing)if(!keys.has(old.eventKey))await ctx.db.patch(old._id,{active:false});return events.length;
}});
function localDay(now:number){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export const assemble=internalMutation({args:{},returns:v.string(),handler:async(ctx)=>{
 const now=Date.now(),cutoff=localDay(now);const [y,m,d]=cutoff.split('-').map(Number);const endDate=new Date(Date.UTC(y,m-1,d+7));const through=endDate.toISOString().slice(0,10);
 const source=await ctx.db.query('sources').withIndex('by_url',q=>q.eq('url','https://www.wadsworthcity.com/Calendar.aspx')).unique();
 const coverage:string[]=[];const fresh=!!source?.lastSuccess&&now-source.lastSuccess<36*3600000&&!source.error;
 const events=fresh?await ctx.db.query('calendarEvents').withIndex('by_active_and_startLocal',q=>q.eq('active',true).gte('startLocal',cutoff+'T00:00:00').lt('startLocal',through+'T00:00:00')).take(35):[];
 if(!fresh)coverage.push('City calendar unavailable or stale. No current meeting claims published.');
 if(cutoff.slice(0,7)!==through.slice(0,7))coverage.push('This interval crosses a month boundary. The next month is not yet collected; calendar coverage is incomplete.');
 const agenda=await ctx.db.query('sources').withIndex('by_url',q=>q.eq('url','https://www.wadsworthcity.com/AgendaCenter')).unique();coverage.push(agenda?.lastSuccess&&!agenda.error?'Agenda index collected; document interpretation is not yet automated.':'Agenda index unavailable; decisions are not inferred.');
 coverage.push('This first automatic edition covers the city calendar only. School, county, project and legislative reporting still require working adapters.');
 const items=events.map(e=>({title:e.title,date:e.startLocal,location:e.location,source:e.url,body:`${e.title} is listed on the city calendar at ${e.location}. Follow the original notice for participation details and any schedule changes.`,checkedAt:e.seenAt}));
 const body=JSON.stringify({title:'The week ahead in Wadsworth',items,method:'Structured city-calendar records, automatically collected and assembled. Times are America/New_York. No model-generated factual claims.'});
 const slug=cutoff;const old=await ctx.db.query('automaticEditions').withIndex('by_slug',q=>q.eq('slug',slug)).unique();
 // Published editions are immutable. A changed same-day run remains in document versions; the next edition receives the change.
 if(old)return old.slug;
 await ctx.db.insert('automaticEditions',{slug,cutoff,through,generatedAt:now,version:1,body,coverage});return slug;
}});
export const latest=query({args:{},returns:v.union(v.object(issueFields),v.null()),handler:async(ctx)=>{const row=await ctx.db.query('automaticEditions').withIndex('by_generatedAt').order('desc').first();if(!row)return null;const {slug,cutoff,through,generatedAt,version,body,coverage}=row;return {slug,cutoff,through,generatedAt,version,body,coverage};}});
export const get=query({args:{slug:v.string()},returns:v.union(v.object(issueFields),v.null()),handler:async(ctx,{slug})=>{const row=await ctx.db.query('automaticEditions').withIndex('by_slug',q=>q.eq('slug',slug)).unique();if(!row)return null;const {cutoff,through,generatedAt,version,body,coverage}=row;return {slug,cutoff,through,generatedAt,version,body,coverage};}});
