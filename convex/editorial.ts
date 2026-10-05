import { internalMutation, query } from './_generated/server';
import { v } from 'convex/values';
import { recordFields } from './schema';
import { cutoff, projects, stories, meetings, representatives, sources } from '../lib/data';
export const feed = query({args:{},returns:v.array(v.object(recordFields)),handler:async(ctx)=>{
 const rows = await ctx.db.query('records').withIndex('by_status',q=>q.eq('status','published')).take(150);
 return rows.map(({slug,kind,title,body,status,verifiedAt})=>({slug,kind,title,body,status,verifiedAt}));
}});
export const seed = internalMutation({args:{},returns:v.number(),handler:async(ctx)=>{
 const groups = [projects.map(p=>({slug:p.slug,title:p.name,kind:'project' as const,body:JSON.stringify(p)})),stories.map(p=>({slug:p.slug,title:p.title,kind:'story' as const,body:JSON.stringify(p)})),meetings.map(p=>({slug:p.id,title:p.title,kind:'meeting' as const,body:JSON.stringify(p)})),representatives.map(p=>({slug:p.name.toLowerCase().replaceAll(' ','-'),title:p.name,kind:'representative' as const,body:JSON.stringify(p)})),sources.map((p,i)=>({slug:`source-${i}`,title:p.title,kind:'source' as const,body:JSON.stringify(p)}))].flat();
 for(const row of groups){const existing=await ctx.db.query('records').withIndex('by_slug_and_kind',q=>q.eq('slug',row.slug).eq('kind',row.kind)).unique();const value={...row,status:'published' as const,verifiedAt:cutoff};if(existing)await ctx.db.patch(existing._id,value);else await ctx.db.insert('records',value);}
 const edition=await ctx.db.query('editions').withIndex('by_slug',q=>q.eq('slug','2026-10-05')).unique();if(!edition)await ctx.db.insert('editions',{slug:cutoff,cutoff,recordSlugs:stories.map(s=>s.slug),version:1,status:'published'});
 return groups.length;
}});
export const importDraft = internalMutation({args:{slug:v.string(),title:v.string(),body:v.string(),verifiedAt:v.string()},returns:v.id('records'),handler:async(ctx,args)=>{
 const value={...args,kind:'story' as const,status:'draft' as const};
 const existing=await ctx.db.query('records').withIndex('by_slug_and_kind',q=>q.eq('slug',args.slug).eq('kind','story')).unique();
 if(existing){if(existing.status==='published')throw new Error('Use a new revision slug for a published story.');await ctx.db.patch(existing._id,value);return existing._id;}return await ctx.db.insert('records',value);
}});
export const publish = internalMutation({args:{slug:v.string()},returns:v.null(),handler:async(ctx,{slug})=>{
 const record=await ctx.db.query('records').withIndex('by_slug_and_kind',q=>q.eq('slug',slug).eq('kind','story')).unique();if(!record)throw new Error('Draft not found');
 const story=JSON.parse(record.body);if(!story.title||!story.body||!story.source?.url||!story.source?.checked)throw new Error('Title, explanation, original evidence and review date required');
 if(!sources.some(s=>new URL(s.url).hostname===new URL(story.source.url).hostname))throw new Error('Source owner is not on the allowlist');
 await ctx.db.patch(record._id,{status:'published'});return null;
}});
