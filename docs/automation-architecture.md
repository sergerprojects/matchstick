# Hands-off Matchstick

Chris's October 5 instruction establishes the operating requirement: after setup, original sources update automatically and the weekly paper publishes without his involvement. This supersedes the prototype plan's human review queue as an everyday dependency.

## Pipeline

1. Scheduled adapters fetch allowlisted original sources; record attempts, successes and failures.
2. Preserve meaningful document versions and source dates. Identify jurisdiction, reporting period and authoritative record type.
3. Normalize events, decisions, votes, projects and notices. Keep proposals distinct from outcomes.
4. Connect records by stable office, parcel, contract, bill and meeting identifiers. Ambiguous links remain unconnected.
5. Select and route individual changes using `editorial-system-prompt.md` and `editorial-contract.md`. A source link alone is insufficient. Identify concrete resident value, deduplicate prior coverage and keep routine notices in calendar/service/reference destinations. Zero selected news stories is valid. Draft eligible stories using the canonical prompt and claim-level evidence.
6. Resolve useful inline context under `embedded-context-policy.md`, including verified subject pins for location stories. Run a separate editorial invocation using `editorial-review-prompt.md`; release only eligible, supported drafts with PASS for the same evidence/draft version. Deterministic gates reject malformed output, unsupported source/excerpt references, weak provenance, wrong jurisdiction, stale coverage and incompatible versions. Optional context failure keeps the useful text; uncertain facts remain held. Neither a model review nor mechanical checks guarantee factual accuracy.
7. Publish the updated subject history and immutable weekly issue. Subsequent changes appear as dated revisions/corrections.
8. Monitoring handles bounded retries, quarantined source changes and recovery. Source outages should not create an ordinary task for Chris. Operational failures still require someone to maintain the service; autonomous publication is not a promise of maintenance-free software.

## Implemented slice

Convex stores publication records, source runs, versioned documents, normalized calendar events and fixed automatic editions. Daily and Monday cron jobs are configured locally. Both city source indexes are collected. The calendar's schema.org event markup is parsed, with bounded import, required fields, owner check and inactive-event handling. Weekly publication checks a 36-hour freshness window and automatically creates a dated issue with original URLs and explicit coverage.

The October 5 routine imported 18 calendar events and published six within its seven-day interval. No LLM, account login or paid API call was needed. The first design edition and the automatic issue are separate surfaces.

## Remaining contracts

- Next-month calendar coverage and cancellation/change notices between issues.
- Agendas, approved minutes, contracts and bid notices: discover documents and extract structured changes; never infer a vote from an agenda.
- School system: supported retrieval path and document extraction.
- County: export routes, city/township separation and service relevance rules.
- Offices/legislatures: tenure changes, bill versions and recorded member votes.
- Businesses: authoritative tenant/opening evidence; a permit or rumor is insufficient.
- Safety: supported aggregate series and official registry access; avoid automated judgments about individuals.
- Gazette: current publisher-supported headline access and permitted attribution.
- Optional model integration: explicit credential setup, budget and output gates; no reuse of another project's secrets.
- Always-on hosting, health monitoring, retention, backups and recovery. Current local scheduling stops when the local backend stops.

## Editorial accountability

An independent automated publication still needs a public owner and corrections route before launch. Routine drafts do not wait for Chris. Any exceptional manual intervention is an operational recovery path, not the standard publishing workflow.

## October 5 editorial and context requirements

Chris rejected a routine school-board rescheduling notice as news and requested an operational selection/writing standard, not a one-card repair. The canonical writer and reviewer prompts now define resident value, routing, human-readable prose, omission, evidence and independent review. The contract contains synthetic acceptance examples and release conditions. Chris also requested far more embedded context and fewer required exits; verified maps, relevant documents/clips, defined charts and structured records are enrichment requirements.

These requirements are documented and binding for subsequent implementation. The calendar-only publisher and static prototype do not yet load these prompts or enforce the news-release contract. No LLM calls, model credentials, source adapters or public reader changes were introduced in this pass.
