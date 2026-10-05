import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
const sourceUrls=['https://www.wadsworthcity.com/AgendaCenter','https://www.wadsworthcity.com/Calendar.aspx'];
export const persist = internalMutation({args:{url:v.string(),title:v.string(),hash:v.string(),text:v.string(),startedAt:v.number(),error:v.optional(v.string())},returns:v.null(),handler:async(ctx,args)=>{
 if(!sourceUrls.includes(args.url))throw new Error('Source not allowed');const now=Date.now();
 const source=await ctx.db.query('sources').withIndex('by_url',q=>q.eq('url',args.url)).unique();const value={url:args.url,title:args.title,mode:'collector' as const,lastAttempt:now,...(!args.error?{lastSuccess:now,error:undefined}:{error:args.error})};
 const sourceId=source?source._id:await ctx.db.insert('sources',value);if(source)await ctx.db.patch(source._id,value);
 let changed=0;if(!args.error){const old=await ctx.db.query('documents').withIndex('by_url',q=>q.eq('url',args.url)).unique();const documentId=old?old._id:await ctx.db.insert('documents',{url:args.url,sourceId,hash:args.hash,retrievedAt:now,title:args.title});if(!old||old.hash!==args.hash){await ctx.db.insert('documentVersions',{documentId,hash:args.hash,text:args.text,retrievedAt:now});changed=1;}if(old)await ctx.db.patch(old._id,{hash:args.hash,retrievedAt:now});}
 await ctx.db.insert('collectionRuns',{sourceId,startedAt:args.startedAt,finishedAt:now,state:args.error?'failed':'success',discovered:changed,...(args.error?{error:args.error}:{})});return null;
}});
export const refresh = internalAction({args:{},returns:v.array(v.object({url:v.string(),state:v.string()})),handler:async(ctx)=>{
 const result=[];for(const url of sourceUrls){const startedAt=Date.now();try{const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);const html=await response.text();if(html.length>1500000)throw new Error('Source exceeds bounded collection size');
 const text=html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(text.length<200||/verify you are human|access denied|just a moment/i.test(text))throw new Error('Source blocked or returned an incomplete page');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));const hash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');await ctx.runMutation(internal.collectors.persist,{url,title:url.includes('AgendaCenter')?'City agendas':'City calendar',text:text.slice(0,250000),hash,startedAt});result.push({url,state:'success'});
 }catch(e){await ctx.runMutation(internal.collectors.persist,{url,title:'City source',text:'',hash:'',startedAt,error:String(e).slice(0,300)});result.push({url,state:'failed'});}}return result;
}});
export const status=query({args:{},returns:v.array(v.object({url:v.string(),title:v.string(),lastAttempt:v.optional(v.number()),lastSuccess:v.optional(v.number()),error:v.optional(v.string())})),handler:async(ctx)=>(await ctx.db.query('sources').withIndex('by_url').take(30)).map(({url,title,lastAttempt,lastSuccess,error})=>({url,title,lastAttempt,lastSuccess,error}))});
