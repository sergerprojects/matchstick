# Resident tools and editorial lens — October 5, 2026

## The product question

Would a local business owner, busy mom, prospective mover, casual Wadsworth Neighbors Facebook reader, or dad of a school student care? Which reader, and what specifically do they gain? Apply this to every item and every feature. One meaningful perspective is enough. Do not make quotas, stereotypes or popularity the standard. Why does it matter now is a separate required question.

Canonical writer and independent reviewer prompts are now v2. The rendering gate in `lib/news-policy.ts` excludes missing editorial metadata, calendar/reference items and stale news from current news slots. Seed fallbacks cannot reinstate those items. This is a prototype safeguard; it is not the independent automatic review service or a complete publishing backend.

## Implemented tools

- Safety: city-linked LexisNexis crime map iframe and fullscreen control. Visitors accept the provider's terms themselves. No copied incident or registry data.
- Registry: the sheriff's direct provider disclaimer/search entry point, instead of the sheriff homepage. Required provider notices remain intact.
- Ward: inline zoomable official February 2026 map. Readers find their street and choose a ward; no automatic address matching or guessed boundaries.
- Representatives: official portraits for the seven council members, president and mayor. Mark Romanchuk's official portrait added. Verified federal socials remain; unavailable socials are omitted silently. City-wide social accounts are not mislabeled as a council member's account. Research on official profiles, local candidate pages and search did not establish individual council social links; this is not proof they have no accounts.
- Permits: automatic native import of the previous month's commercial report; only work sites marked WADSWORTH CITY. Owner/contractor mailing addresses and names are excluded. Related electrical/HVAC entries combine by permit ID. Search/filter by address, scope and permit number. Major work appears by default; routine systems stay in the lookup tool. No tenant or opening-date inference.
- Legislation: native searchable Mark Romanchuk primary-sponsored bills, official current version and completed progress steps. It is a reference tracker, not a claim that every bill is new or a complete voting record. Sponsorship, chamber passage and law are separate. Bill titles are official record titles, not generated claims of local benefits.
- Roundabout: plain account of the location, proposed scope, 2028 cost estimate, identified funding and proposed traffic impacts. It is ongoing project context, not fabricated current construction news.
- Main newspaper: no permanent Gazette promotion or county-form promotion in news slots. Sources remain in the source register and evidence details. Empty topics do not get filler. Unavailable details do not create development notes in reader copy.

## Daily delivery

`scripts/collect-resident-tools.mjs` collects bounded public HTML, validates the expected source structure and period, and writes JSON snapshots. Collection failure retains a successful snapshot and marks it stale; it does not replace failure with zero work. The Pages workflow runs daily at 10:23 UTC, saves snapshots back to the existing branch and publishes the export. GitHub schedules may run late. No credentials, paid model calls or new database infrastructure added.

The previous-month county report rolls forward as the county publishes each monthly report. This is not same-day permit coverage. Legislative progress refreshes daily; event/action dates must be established separately before a bill becomes news. Daily collection does not refresh the date of the fixed October 5 newspaper or manufacture new stories.

## Remaining integrations

Automatic minutes-to-news writing/review, broader local/state/federal sponsored-bill coverage, business opening confirmation, current-period permit search and address-to-ward geospatial matching still require adapters. The House Clerk 2026 index returned HTTP 404 during this pass; no vote data was invented. The Brickyard name and State/Reimer intersection did not resolve through the public geocoder; no guessed coordinates or false project pins were added. The map enrichment contract holds unresolved locations until a verified locator is available. The existing area map is explicitly labeled as geographic orientation.

No test suite was added or run. Static export and TypeScript compilation were run as publication steps.

## Bill tracker coverage — October 5, 2026

Collapsed bill cards now show five actual milestones (introduced, Senate passage, House passage, sent to governor, signed) and a plain current-stage label. Governor receipt and signature require the official completed final-stage marker. The collector refreshes that marker daily, retains successful data on failure, and orders chamber steps by the bill's Senate origin. This is a milestone display, not a probability or a voting score.

Only Mark Romanchuk's 13 primary-sponsored bills are connected to the live tracker. Sean Hutson's official legislation profile returned an empty listing on October 5; that does not establish zero legislative activity or voting history. Moreno and Husted publish paginated sponsored-legislation tables on their official sites; they are feasible future inputs, but are not connected. Congress.gov blocked the Miller member-page request with HTTP 403; GovInfo Bill Status XML is a supported official route for bill actions once sponsor discovery is connected. Local ordinances and school board decisions need their own routes; they do not share the state/federal bill-to-signature process.

The public Pages workflow refreshes the permit and Romanchuk tools only. It does not collect city/school approved minutes or generate resident news. The local Convex calendar publisher and exported issue are separate from that public refresh. The Chick-fil-A project appears in the approved August 3 council minutes (Ordinance 26-082, adopted; planning commission approval June 8); discovering that information required a manual source lookup. Do not claim minute-driven autonomous news publication until document discovery, extraction, editorial selection, evidence review and publication are connected end to end.

## Sponsored bills, with optional external vote records

Chris clarified that the in-app focus is bills each representative sponsors and their progress, not a full vote-history interface. Voting records are external links on each legislator card. Moreno and Husted link to their individual official voting records; Miller links to the House Clerk member profile with recent votes. Ohio House/Senate links explicitly say session journals: these are chamber-wide original records, not individual filtered histories. No vote-history import or scoring is planned.


## Calendar event usability — October 5

Event dialogs display date/time, place and collected description directly. No link-only “Official notice” accordion. A small direct source credit remains at the bottom; community events prefer the known Main Street organizer entry when merged with the city calendar. Native .ics downloads use source-confirmed timestamps, locations and descriptions, preserve all-day exclusive end dates and omit unknown end times. Conflicting schedules have no calendar-download action. This downloads a calendar file for the resident to import; it does not subscribe, create an account or modify a personal calendar automatically.
