# Understand it here

Chris's October 5 prototype feedback establishes an operational product requirement: far more useful inline context, fewer necessary exits. This is part of story assembly and source-adapter design, not a one-off map patch.

## Reader experience

The useful fact and its meaning are readable in Matchstick. Original-source links remain available for attribution, verification, participation and complete records. A reader should not need to leave to discover the basic story. Place supporting context beside the relevant explanation. Avoid a wall of unrelated iframes or a requirement to read/watch the full underlying document.

| Story or task | In-site treatment |
| --- | --- |
| Construction, park, business, road or place-specific story | Named map pin at the verified subject; useful site image/plan when available; status and timeline |
| School/council decision | Relevant decision excerpt and document page; optional meeting video at the evidenced segment |
| Local representative's work | Bill/status and recorded vote context, brief explanation, source details; optional relevant official clip |
| Spending, budget or statistics | Defined period/geography, useful comparison table/chart, actual amounts and original evidence |
| Service disruption | Affected area/map where verified, timing, plain action and update time |
| Permits | Relevant structured permit facts and project history in-site when supported access exists |
| Community event | Place, time, useful details and optional map; calendar destination unless there is actual news |
| Safety | Supported aggregate trends/maps with definitions; official registry access as permitted, without generated person-level summaries or copied personal data |
| Independent journalism | Supported licensed headline/summary/embed with attribution; original publisher for complete reporting when rights or access require it |

These are intended treatments, not claims that provider APIs, licenses or iframe support have been verified or implemented.

## Location rules

Resolve source-backed place/address to coordinates through a supported geocoder or authoritative geographic record. Persist evidence URL/anchor, address, coordinates, precision, resolver/version and checked date. Ambiguous matches remain unpinned. Verify that the match is in the expected jurisdiction and describes the story subject. Do not substitute the council chamber, contractor office, centroid of Wadsworth or mailing address for the project.

Show a labeled point; use a boundary or closure segment only when an authoritative source supplies that geometry. Label an approximate site honestly. Distinguish current and proposed work. Cluster/legend multi-location stories meaningfully. A reader can open directions from the map when useful. No automatic precise resident location collection is required.

## Context adapter contract

After selection, the enrichment stage resolves the writer's `inlineContext` requests. It does not invent news to justify an embed. Store asset/source IDs, canonical URL, provider, asset kind, event/document date, checked time, page/timestamp/coordinates, attribution/rights, framing support, accessibility fallback, stale/failed state and explanatory purpose. Choose native structured rendering when supported data is available; otherwise use the provider's supported embed. A link is the fallback when the provider prohibits or cannot support inline use.

Use reviewed provider origins and controlled URL builders. Never insert model-generated arbitrary iframe HTML or run source-page scripts. Do not bypass framing restrictions, paywalls or authentication. Include source credit with the asset. Do not imply third-party live content is a preserved edition snapshot: distinguish captured records from live embeds and show a failure/stale state when appropriate.

Load heavy media on demand or near the viewport, reserve dimensions, prevent mobile horizontal overflow and provide keyboard-accessible controls, descriptive iframe titles, text equivalents and source fallbacks. If an embed fails, retain the useful story and replace the context area with a concise fallback. Optional enrichment failure should not disable routine publication.

## Automatic assembly requirements

1. Each eligible story gets a context plan; an empty plan is permitted when an embed adds nothing.
2. Location stories request pin enrichment by default, with a clear unresolved-location state internally.
3. Only VERIFIED context with supported delivery/rights renders; pending requests remain requests.
4. The independent reviewer checks that context supports the actual story and that the story explains the point without requiring an exit.
5. Publication validates asset origins, evidence versions, coordinates/precision and attribution separately from prose.
6. Keep maps, document viewers, clips and structured cards reusable so every adapter benefits. This is a pipeline requirement, not manual weekly design work for Chris.

## Prototype boundary

The current project map is an area-orientation embed, not a verified Brickyard pin. Crime-map, registry, permit and some source experiences currently link out. This document sets the upgrade contract; it does not claim those integrations or location enrichment are already live. No prototype reader content or individual map was changed in this pass.

## October 5 crime-map implementation

The Safety page now includes a controlled iframe of the city-linked LexisNexis Community Crime Map, using the exact Wadsworth agency URL from https://www.wadsworthcity.com/909/LexisNexis-Community-Crime-Map. Provider URL: https://communitycrimemap.com/?agency-jump-dropdown=OH%20-%20Wadsworth. Public response headers checked October 5 allow framing (no X-Frame-Options or frame-ancestors restriction observed). The provider presents its own first-use terms/Continue dialog inside the frame; Matchstick does not accept terms on a visitor’s behalf.

The map is the primary experience, with mobile dimensions, a user-triggered browser fullscreen control, attribution, coverage context and a secondary loading fallback link. It is live provider content, not captured crime data or a statistical import. The provider describes its agency-selected reports at https://risk.lexisnexis.com/products/community-crime-map. The remaining external registry/records/road tools are unchanged.
