import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export const recordFields = { slug:v.string(), kind:v.union(v.literal('story'),v.literal('project'),v.literal('meeting'),v.literal('representative'),v.literal('source')), title:v.string(), body:v.string(), status:v.union(v.literal('draft'),v.literal('published')), verifiedAt:v.string() };
export default defineSchema({
 calendarEvents:defineTable({eventKey:v.string(),title:v.string(),startLocal:v.string(),location:v.string(),url:v.string(),sourceUrl:v.string(),seenAt:v.number(),active:v.boolean()}).index('by_eventKey',['eventKey']).index('by_active_and_startLocal',['active','startLocal']),
 automaticEditions:defineTable({slug:v.string(),cutoff:v.string(),through:v.string(),generatedAt:v.number(),version:v.number(),body:v.string(),coverage:v.array(v.string())}).index('by_slug',['slug']).index('by_generatedAt',['generatedAt']),
 records:defineTable(recordFields).index('by_status',['status']).index('by_slug_and_kind',['slug','kind']),
 sources:defineTable({url:v.string(),title:v.string(),mode:v.union(v.literal('manual'),v.literal('collector')),lastAttempt:v.optional(v.number()),lastSuccess:v.optional(v.number()),error:v.optional(v.string())}).index('by_url',['url']),
 documents:defineTable({url:v.string(),sourceId:v.id('sources'),hash:v.string(),retrievedAt:v.number(),title:v.string()}).index('by_url',['url']),
 documentVersions:defineTable({documentId:v.id('documents'),hash:v.string(),text:v.string(),retrievedAt:v.number()}).index('by_documentId',['documentId']),
 collectionRuns:defineTable({sourceId:v.id('sources'),startedAt:v.number(),finishedAt:v.number(),state:v.union(v.literal('success'),v.literal('failed')),discovered:v.number(),error:v.optional(v.string())}).index('by_sourceId',['sourceId']),
 editions:defineTable({slug:v.string(),cutoff:v.string(),recordSlugs:v.array(v.string()),version:v.number(),status:v.union(v.literal('draft'),v.literal('published'))}).index('by_slug',['slug']),
});
