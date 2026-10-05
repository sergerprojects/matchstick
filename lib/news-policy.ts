export type ReaderPerspective='business_owner'|'busy_parent'|'prospective_mover'|'casual_neighbor'|'school_parent';
export type EditorialDecision={destination:'NEWS'|'EXPLAINER'|'CALENDAR'|'REFERENCE'|'HOLD';eventDate:string;readerPerspectives:ReaderPerspective[];residentValue:string;change:string;whyNow:string;review:'prototype-curated'|'independent-pass'|'pending';decisionDate?:string;availabilityDate?:string;publicationMode?:string;publicationCutoff?:string};
// Rendering safeguard. Automatic publication still requires evidence hashes and the separate reviewer.
export function eligibleNews<T extends {editorial?:EditorialDecision}>(items:T[],cutoff:string):T[]{
 const day=Date.parse(cutoff+'T12:00:00Z');
 return items.filter(({editorial:e})=>{
  if(!e||!['NEWS','EXPLAINER'].includes(e.destination)||!['prototype-curated','independent-pass'].includes(e.review)||!Array.isArray(e.readerPerspectives)||!e.readerPerspectives.some(p=>['business_owner','busy_parent','prospective_mover','casual_neighbor','school_parent'].includes(p))||typeof e.residentValue!=='string'||!e.residentValue.trim()||typeof e.change!=='string'||!e.change.trim()||typeof e.whyNow!=='string'||!e.whyNow.trim())return false;
  const date=Date.parse(e.eventDate+'T12:00:00Z');if(!Number.isFinite(day))return false;
  if(e.destination==='NEWS'){const available=Date.parse((e.availabilityDate||'')+'T12:00:00Z');return Number.isFinite(date)&&date<=day&&(day-date<=(e.publicationMode==='catch-up'&&e.publicationCutoff===cutoff?90:14)*86400000||(Number.isFinite(available)&&available<=day&&day-available<=14*86400000));}
  const decision=Date.parse((e.decisionDate||'')+'T12:00:00Z');return Number.isFinite(decision)&&decision>=day&&decision-day<=30*86400000;
 });
}
