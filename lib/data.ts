export const cutoff = '2026-10-05';
export type Evidence = { title: string; url: string; owner: string; checked: string; published?: string; note?: string };
export type Project = { slug: string; name: string; category: string; stage: string; location: string; description: string; next: string; date: string; evidence: Evidence[]; timeline: {date: string; title: string; text: string}[] };
const city = (title: string, path: string, note?: string): Evidence => ({title, url: `https://www.wadsworthcity.com/${path}`, owner:'City of Wadsworth', checked:cutoff, note});
export const sources: Evidence[] = [
 city('City meeting agendas & minutes','AgendaCenter','Manual discovery; automated collection is in development.'),
 city('City calendar','Calendar.aspx','Meeting times can change; check the original before attending.'),
 city('City projects & contracts','429/City-Projects'),
 city('City council directory','m/directory/department?did=52'),
 city('Official ward maps','422/Maps','Address matching is not available in this prototype.'),
 {title:'School board meetings & records',url:'https://www.wadsworthschools.org/board-of-education-2',owner:'Wadsworth City Schools',checked:cutoff,note:'Manually reviewed. Automated retrieval previously returned 403.'},
 {title:'School finances',url:'https://www.wadsworthschools.org/departments/treasurers-office',owner:'Wadsworth City Schools',checked:cutoff,note:'Original financial documents; no financial claims imported yet.'},
 {title:'County permits',url:'https://building.medinaco.org/permits/',owner:'Medina County Building Department',checked:cutoff,note:'Search by address. Bulk import has not been connected.'},
 {title:'County commissioners',url:'https://www.medinaco.org/county-commissioners/',owner:'Medina County',checked:cutoff,note:'Official records linked; Wadsworth relevance still reviewed manually.'},
 {title:'County road closures',url:'https://engineer.medinacounty.gov/cgi-bin/rd_close',owner:'Medina County Engineer',checked:cutoff,note:'County roads; separate from city streets and state routes.'},
 city('Police records','368/Records','Public records requests and department records.'),
 city('Official crime map','909/LexisNexis-Community-Crime-Map','External provider. No incident data copied into Matchstick.'),
 {title:'Sheriff & offender lookup',url:'https://medinasheriff.org/',owner:'Medina County Sheriff',checked:cutoff,note:'Use the official registered-offender search. No personal registry records stored here.'},
 {title:'Ohio House directory',url:'https://www.ohiohouse.gov/members/directory',owner:'Ohio House of Representatives',checked:cutoff},
 {title:'Ohio legislation',url:'https://legislature.ohio.gov/',owner:'Ohio General Assembly',checked:cutoff,note:'Bill and vote ingestion is planned; activity is not represented as complete.'},
 {title:'Federal legislation',url:'https://www.congress.gov/',owner:'Library of Congress',checked:cutoff},
 {title:'U.S. House roll calls',url:'https://clerk.house.gov/evs/2026/index.asp',owner:'Clerk of the U.S. House',checked:cutoff},
 {title:'Library events',url:'https://wadsworthlibrary.events.mylibrary.digital/',owner:'Wadsworth Public Library',checked:cutoff},
 {title:'Medina Gazette · Local News',url:'https://medina-gazette.com/news-category/news/local-news/11/18/',owner:'Medina Gazette · independent journalism',checked:cutoff,note:'Publisher links only. Article syndication has not been established.'},
];
export const projects: Project[] = [
 {slug:'brickyard-pond-loop',name:'A new chapter at the Brickyard',category:'Parks & public space',stage:'Bidding',location:'Brickyard · south Wadsworth',description:'The city has opened bidding for the Brickyard Pond Loop project. The next concrete milestone is the bid deadline—not a confirmed park opening.',next:'Bids close October 7 at 11:30 a.m.',date:'October 7, 2026',evidence:[{...city('Brickyard Pond Loop · Bid 2026-406','bids.aspx?bidID=198'),published:'2026-09-18'},city('Brickyard project overview','985/Brickyard-Project','Background page; not a current construction progress report.')],timeline:[{date:'SEP 18, 2026',title:'Bid notice published',text:'The city opened bidding for contract 2026-406.'},{date:'OCT 7, 2026',title:'Bid deadline',text:'Submissions are due at 11:30 a.m. This is a scheduled deadline, not an award.'},{date:'NEXT',title:'Award & construction',text:'An award, work schedule and opening date have not been established in this edition.'}]},
 {slug:'sr94-reimer',name:'The roundabout question',category:'Roads & utilities',stage:'Proposed',location:'State Road (SR 94) & Reimer Road',description:'The city’s project page describes a proposed single-lane roundabout at SR 94 and Reimer Road. A proposal is not a current road closure.',next:'Check the city project page for design and schedule changes.',date:'Schedule not confirmed',evidence:[city('SR 94 & Reimer Road Roundabout','1038/SR-94-and-Reimer-Road-Roundabout-Project','Official HTML was successfully collected October 5. Traffic closures are proposed impacts, not a current closure notice.')],timeline:[{date:'PROPOSAL',title:'Intersection improvement',text:'The official project page describes a single-lane roundabout.'},{date:'TO BE VERIFIED',title:'Current approvals & timing',text:'The next approval, start date and traffic impacts have not been independently established for this prototype.'}]},
 {slug:'city-project-register',name:'Follow the city’s construction ledger',category:'Roads & utilities',stage:'Project register',location:'Citywide',description:'The city maintains project listings, bid notices and bid tabs. These records help distinguish planned work from an awarded contract.',next:'Open the official register for individual contracts.',date:'Ongoing register',evidence:[city('City projects register','429/City-Projects')],timeline:[{date:'SOURCE',title:'City project register',text:'Contract-level notices and bid tabs provide the starting point.'},{date:'NEXT',title:'Connect the records',text:'Individual project histories and construction notices will be added as their records are reviewed.'}]},
];
export const meetings = [
 {id:'council-oct6',day:'06',month:'OCT',title:'City Council',time:'Tuesday · 6:30 p.m.',place:'City Hall · 120 Maple Street',type:'City hall',date:'2026-10-06T18:30:00-04:00',url:'https://wadsworthcity.com/Calendar.aspx?EID=2116&calType=0&day=6&month=10&year=2026'},
 {id:'bid-oct7',day:'07',month:'OCT',title:'Brickyard bids close',time:'Wednesday · 11:30 a.m.',place:'Bid 2026-406 · deadline',type:'Projects',date:'2026-10-07T11:30:00-04:00',url:'https://www.wadsworthcity.com/bids.aspx?bidID=198'},
 {id:'board-oct12',day:'12',month:'OCT',title:'School Board',time:'Monday · 7 p.m.',place:'McIlvaine Performing Arts Center · 625 Broad Street',type:'Schools',date:'2026-10-12T19:00:00-04:00',url:'https://www.wadsworthschools.org/board-of-education-2'},
 {id:'scare-oct17',day:'17',month:'OCT',title:'Scare on the Square',time:'Saturday · 5:30–8 p.m.',place:'Downtown · includes Wadsworth Thriller',type:'Around town',date:'2026-10-17T17:30:00-04:00',url:'https://wadsworthcity.com/Calendar.aspx'},
 {id:'trick-oct31',day:'31',month:'OCT',title:'Trick or treat',time:'Saturday · 6–8 p.m.',place:'Wadsworth · official city calendar',type:'Around town',date:'2026-10-31T18:00:00-04:00',url:'https://wadsworthcity.com/Calendar.aspx'},
];
export type Representative = {name:string;office:string;level:string;ward?:string;url:string;email?:string;phone?:string;social?:{label:string;url:string}[];note?:string};
const councilUrl='https://www.wadsworthcity.com/m/directory/department?did=52';
export const representatives: Representative[] = [
 {name:'Mike Reese',office:'City Council · Ward 1',level:'City',ward:'1',url:councilUrl,email:'mreese@wadsworthcity.org',phone:'330-421-8909'},
 {name:'Jon Yurchiak',office:'City Council · Ward 2',level:'City',ward:'2',url:councilUrl,email:'jyurchiak@wadsworthcity.org',phone:'614-592-4876'},
 {name:'Jeanne Hines',office:'City Council · Ward 3',level:'City',ward:'3',url:councilUrl,email:'jhines@wadsworthcity.org',phone:'330-730-4556'},
 {name:'Angela May',office:'City Council · Ward 4',level:'City',ward:'4',url:councilUrl,email:'amay@wadsworthcity.org',phone:'330-485-6167'},
 {name:'Chris Maxwell',office:'City Council · At large',level:'City',url:councilUrl,email:'cmaxwell@wadsworthcity.org'},
 {name:'Tom Stugmyer',office:'City Council · At large',level:'City',url:councilUrl,email:'tstugmyer@wadsworthcity.org'},
 {name:'Zach Berger',office:'City Council · At large',level:'City',url:councilUrl,email:'zberger@wadsworthcity.org'},
 {name:'Robin Laubaugh',office:'Mayor',level:'City',url:'https://www.wadsworthcity.com/'},
 {name:'Tim Beck',office:'School Board · President',level:'Schools',url:'https://www.wadsworthschools.org/board-of-education-2',email:'tbeck@wadsworthschools.org'},
 ...['Julie Batey','Tom Fisher','Amanda Gordon','Jill Stevens'].map(name=>({name,office:'School Board'+(name==='Julie Batey'?' · Vice President':''),level:'Schools',url:'https://www.wadsworthschools.org/board-of-education-2'})),
 {name:'Sean Hutson',office:'Ohio House · District 66',level:'State',url:'https://www.ohiohouse.gov/members/directory',note:'Appointed September 30, 2026. Verify your district using the official finder.'},
 {name:'Mark Romanchuk',office:'Ohio Senate · District 22',level:'State',url:'https://www.ohiosenate.gov/members/mark-romanchuk'},
 {name:'Max Miller',office:'U.S. House · Ohio 7',level:'Federal',url:'https://maxmiller.house.gov/',social:[{label:'@RepMaxMiller · X',url:'https://x.com/RepMaxMiller'},{label:'Instagram',url:'https://www.instagram.com/repmaxmiller/'}]},
 {name:'Bernie Moreno',office:'U.S. Senate · Ohio',level:'Federal',url:'https://www.moreno.senate.gov/',social:[{label:'@berniemoreno · X',url:'https://x.com/berniemoreno'},{label:'Instagram',url:'https://www.instagram.com/senatorberniemoreno/'}]},
 {name:'Jon Husted',office:'U.S. Senate · Ohio',level:'Federal',url:'https://www.husted.senate.gov/',social:[{label:'@SenJonHusted · X',url:'https://x.com/SenJonHusted'},{label:'Instagram',url:'https://www.instagram.com/senjonhusted/'}]},
];
export const stories = [
 {slug:'brickyard-pond-loop',category:'Parks & public space',title:'A new chapter at the Brickyard.',dek:'Bids for the Pond Loop close Wednesday. Here’s the milestone to watch—and what’s still unknown.',body:'The city’s bid notice sets October 7 at 11:30 a.m. as the deadline for the Brickyard Pond Loop. This edition does not establish a contract award, construction start or opening date.',source:projects[0].evidence[0]},
 {slug:'school-board',category:'Schools',title:'Your next school board meeting: October 12.',dek:'7 p.m. at the McIlvaine Performing Arts Center. Find the records, watch the meeting, follow the decisions.',body:'The district lists its next board meeting for October 12, 2026. The September 29 special meeting was canceled after a meeting on September 24. Check the district’s meeting records for agendas and outcomes.',source:sources[5]},
 {slug:'county-permits',category:'Medina County',title:'What’s going up? Start with the permit.',dek:'County building records are the first stop for construction in Wadsworth.',body:'Medina County’s transition notice says city residential permit applications moved to the county January 1, 2025; commercial applications were already handled there. A permit does not establish a business opening date.',source:{title:'Wadsworth residential permit transition',url:'https://www.medinaco.org/wadsworth-city-residential-projects/',owner:'Medina County Building Department',checked:cutoff}},
 {slug:'ohio-house',category:'Your representatives',title:'A new representative in Ohio House District 66.',dek:'Sean Hutson was appointed September 30. The directory matters when offices change.',body:'The Ohio House announced Sean Hutson’s appointment to District 66 on September 30, 2026. Check the official district finder to confirm your address before contacting a representative.',source:{title:'Official appointment announcement',url:'https://ohiohouse.gov/news/republican/sean-hutson-appointed-as-state-representative-for-the-66th-house-district-148966',owner:'Ohio House of Representatives',checked:cutoff,published:'2026-09-30'}},
];
