export type CalendarKind = 'community' | 'public' | 'school' | 'holiday' | 'other';
export const calendarKinds: Record<CalendarKind, {label: string; filter: string}> = {
 community: {label: 'Community event', filter: 'Things to do'},
 public: {label: 'Public meeting', filter: 'Public meetings'},
 school: {label: 'School meeting', filter: 'Schools'},
 holiday: {label: 'Holiday', filter: 'Holidays'},
 other: {label: 'Calendar date', filter: 'Other dates'},
};
export function calendarKind(event: {title: string; type: string}): CalendarKind {
 if (event.type === 'Schools') return 'school';
 if (event.type === 'City meetings') return 'public';
 // Exact holiday names avoid classifying a parade or festival as an office holiday.
 if (/^(?:Veteran(?:s['’]?|['’]s)? Day|Thanksgiving(?: Day)?|Day After Thanksgiving|Christmas (?:Eve|Day)|New Year['’]?s Day|Martin Luther King(?: Jr\.?)? Day|Presidents['’]? Day|Memorial Day|Juneteenth|Independence Day|Labor Day|Columbus Day)$/i.test(event.title.trim())) return 'holiday';
 if (event.type === 'Around town') return 'community';
 return 'other';
}
