import {CalendarPlus,MapPin,Clock,ArrowUpRight} from 'lucide-react';
import {calendarKind,calendarKinds} from '../lib/calendar-kind';
import {eventCalendarDownload,type CalendarEvent} from '../lib/event-calendar';
export default function CalendarEventDetails({event,checkedAt}:{event:CalendarEvent;checkedAt:string}){
 const kind=calendarKind(event),download=eventCalendarDownload(event,checkedAt);
 const when=/\b20\d{2}\b/.test(event.time)?event.time:new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'long',day:'numeric',year:'numeric'}).format(new Date(event.date))+' · '+event.time;
 const organizer=kind==='community'?event.alternateNotices?.find(n=>n.owner==='Main Street Wadsworth'):undefined;
 const source={url:organizer?.url||event.url,owner:organizer?.owner||event.sourceOwner||'Event organizer'};
 return <><span className={`calendar-tag calendar-${kind}`}>{calendarKinds[kind].label}</span>
  <h2 id="calendar-event-title" className="event-title">{event.title}</h2>
  <div className="event-facts"><p><Clock size={18}/><span>{when}</span></p>{event.place&&<p><MapPin size={18}/><span>{event.place}</span></p>}</div>
  {event.description&&<p className="event-description">{event.description}</p>}
  {download&&<a className="event-calendar-action" href={download.href} download={download.filename}><CalendarPlus size={18}/>Add to my calendar</a>}
  <div className="event-source"><span>Source</span><a href={source.url} target="_blank" rel="noopener noreferrer">{source.owner}<ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></div>
 </>;
}
