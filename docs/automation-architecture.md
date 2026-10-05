# Hands-off Matchstick

Chris's October 5 instruction establishes the operating requirement: after setup, original sources update automatically and the weekly paper publishes without his involvement. This supersedes the prototype plan's human review queue as an everyday dependency.

## Pipeline

1. Scheduled adapters fetch allowlisted original sources; record attempts, successes and failures.
2. Preserve meaningful document versions and source dates. Identify jurisdiction, reporting period and authoritative record type.
3. Normalize events, decisions, votes, projects and notices. Keep proposals distinct from outcomes.
4. Connect records by stable office, parcel, contract, bill and meeting identifiers. Ambiguous links remain unconnected.
5. Produce explainers using deterministic templates first. Optional language-model prose uses only the supplied record bundle and sentence-level evidence.
6. Automated publication gates reject unsupported names/dates/numbers, weak evidence, wrong jurisdiction, stale coverage and incompatible source versions. An omission or plain uncertainty state is a valid result.
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
