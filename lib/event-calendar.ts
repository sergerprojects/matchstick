export type CalendarEvent = {
 id: string; title: string; date: string; endDate?: string; allDay?: boolean;
 time: string; place: string; description?: string; url: string; sourceOwner?: string;
 scheduleConflict?: boolean; type: string;
 alternateNotices?: {url: string; owner?: string}[];
};
const escapeText=(value:string)=>value.replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const utc=(value:string)=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
const localDay=(value:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value)).replace(/-/g,'');
function fold(line:string){const encoder=new TextEncoder();let result='',part='';for(const char of line){if(encoder.encode(part+char).length>75){result+=part+'\r\n';part=' ';}part+=char;}return result+part;}
export function eventCalendarDownload(event:CalendarEvent,checkedAt:string){
 if(event.scheduleConflict||!Number.isFinite(Date.parse(event.date))||!Number.isFinite(Date.parse(checkedAt)))return null;
 const end=event.endDate&&Number.isFinite(Date.parse(event.endDate))&&event.endDate>event.date?event.endDate:null;
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Matchstick//Wadsworth Calendar//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',
  'UID:'+escapeText('matchstick-'+event.id+'@sergerprojects.github.io'),'DTSTAMP:'+utc(checkedAt),
  event.allDay?'DTSTART;VALUE=DATE:'+localDay(event.date):'DTSTART:'+utc(event.date),
  ...(end?[event.allDay?'DTEND;VALUE=DATE:'+localDay(end):'DTEND:'+utc(end)]:[]),
  'SUMMARY:'+escapeText(event.title),...(event.place?['LOCATION:'+escapeText(event.place)]:[]),
  ...(event.description?['DESCRIPTION:'+escapeText(event.description)]:[]),'URL:'+event.url.replace(/[\r\n]/g,''),'END:VEVENT','END:VCALENDAR'];
 return {href:'data:text/calendar;charset=utf-8,'+encodeURIComponent(lines.map(fold).join('\r\n')+'\r\n'),filename:'matchstick-'+event.id.replace(/[^a-z0-9-]/gi,'')+'.ics'};
}
