// Public source metadata only. Never export document text or private editorial working records.
export function publicDocumentMetadata({id,url,title,owner,meetingDate,kind,sha256,collectedAt,status,pages,firstSeenAt,changedAt,postedAt,amendedAt,indexObservedAt}){
 return {id,url,title,owner,meetingDate,kind,sha256,collectedAt,status,firstSeenAt,changedAt,postedAt,amendedAt,indexObservedAt,pageCount:pages.length};
}
