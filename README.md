# Matchstick

An independent public-service hub for Wadsworth, Ohio. Next.js 16, TypeScript and Convex. No MyTownView integration. Source: https://github.com/sergerprojects/matchstick. GitHub Pages publishes a dated static preview; autonomous collection still needs an always-on backend.

## Run locally

```sh
npm ci
npm run backend
# In a second terminal:
npm run dev
```

The Convex CLI creates an anonymous local backend and writes this project's local configuration. First-time data setup:

```sh
npx convex run editorial:seed
npx convex run automation:weekly
```

Open http://127.0.0.1:3017. The local Convex backend runs at port 3210. Node 20.9+ is required by Next.js. This project uses the standard Convex runtime; no Node-only actions or account login are needed.

## Working reader

- Editorial home, three project records and source-backed timelines.
- Schools, city/state/federal representatives, real ward selector and official maps.
- Search across the current source-backed edition, project filters and map/list views.
- Browser-local follows in My Wadsworth; no account needed.
- Original-record dialogs, source register, explicit gaps and collection status.
- Official crime-map, registry, permits and road-closure access; no copied personal registry.
- Credited Gazette links; no article syndication.
- Printable fixed first edition at `/edition-preview`.
- Automatically published calendar edition at `/edition`.

## Hands-off operation

This is a product requirement. Routine publication must not depend on Chris approving drafts, collecting records, running commands or reviewing a queue. Initial setup commands are development setup, not the operating model.

Convex schedules daily collection at 08:15 UTC and weekly collection + publication Monday at 10:00 UTC. Local schedules run **only while the local backend is running**. Public always-on hosting is still a launch task.

`automation:daily` collects the city agenda index and calendar, records versions and failures, and parses structured calendar events. `automation:weekly` refreshes sources, checks freshness and assembles a fixed dated edition without an LLM or editor.

Calendar import rejects missing structure, mixed months, missing location/date/official URL and oversized imports. Unchanged pages do not create another document version. Missing events in an authoritative month become inactive. Failed/empty collection does not create a zero-activity claim. Publications include current-source coverage gaps and remain immutable for that cutoff. This first slice parses the displayed month only; next-month collection is needed before month-boundary completeness can be claimed.

Published queries expose no draft records. Collectors, imports, seed and publisher are internal functions. There are no public write functions, editor login, credential integration or paid model calls.

## What remains before a fully autonomous public service

| Area | Current state | Next work |
| --- | --- | --- |
| City calendar | Working automatic collection, normalized events, weekly publication | Month-boundary coverage, schedule correction records, archived editions and incident alerts |
| Agendas/minutes | Automatic index snapshot/versioning | Document discovery, PDF extraction, outcome/roll-call adapters and claim-level evidence |
| Projects | Three manually prepared original-source records | Project/bid/permit adapters with dated state changes and closed deadlines |
| Schools | Original records and dated meeting information | Supported collection route, decisions, finance and policies; 403 failures must remain visible |
| County | Original services/permits links | Wadsworth relevance rules, permit exports, relevant commission actions |
| Representatives | Current directory examples + selected verified socials | Automated office/tenure updates, complete local/county directory and legislative actions |
| Safety | Official crime-map/registry/records links | Defined statistical series and provider-supported integrations |
| Journalism | Gazette publisher link | Supported headline feed or permission to syndicate |
| Publication | Calendar edition auto-published; fixed design edition | Rich multi-source summaries, source-change corrections and automated release quality gates |
| Hosting | Local reader/backend | Always-on public deployment, domain, monitoring and recovery |

An LLM is optional for prose and document interpretation. Add it behind a budget, with evidence for every factual sentence, deterministic checks for names/dates/amounts, and conservative abstention when records conflict. No human approval queue should be required for ordinary items. Keep substantive unknowns visible. Automatic quality gates alone do not prove model-generated claims correct; high-impact allegations and registry/person-level conclusions should never be inferred or written by a model.

## Source and asset rights

The initial snapshot is dated October 5, 2026. Original URLs, owners and review dates are in `lib/data.ts`. Collection dates in the automatic edition are separate from event dates. Prototype records are selected coverage, not a complete civic ledger.

`public/wadsworth-high-school.jpg`: “Wadsworth 7.jpg”, SilentMatt Psychedelic, July 13, 2023, https://commons.wikimedia.org/wiki/File:Wadsworth_7.jpg, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). The UI displays the unchanged source in cropped frames. Credit and license are available in Sources & About. Cropped adaptations remain CC BY-SA 4.0. No generated documentary imagery is used.

## Development evidence

TypeScript compilation and production build were run while creating the prototype. The local publication routine ran and created the October 5 automatic issue from original calendar records. No automated test suite was added or run.

See `docs/design-direction.md` and `docs/automation-architecture.md` for the design rationale and autonomous publication plan.

## GitHub Pages phone preview

The public repository is `sergerprojects/matchstick`. Chris authorized public visibility on October 5, 2026 after the GitHub plan rejected Pages hosting from the private repository.

```sh
npm run snapshot       # include the latest published local issue
npm run build:pages    # static export at /matchstick/
```

Pages uses `/matchstick` as its base path, static image delivery and exported routes. `NEXT_PUBLIC_PREVIEW_MODE=static` disables local Convex connections and includes the published issue and source statuses in the build. No localhost backend or credentials are required on the phone. The preview is a snapshot; live collection is not hosted on GitHub Pages.

The source repository uses `gus/initial-prototype` as its bootstrap/default branch because the local Git hook prohibits direct pushes to main. Pushes to this branch publish the preview through GitHub Actions. Production autonomous data collection still requires an always-on backend and source adapters; the Pages preview does not replace them.

### Publication status — October 5, 2026

Source uploaded to https://github.com/sergerprojects/matchstick, branch `gus/initial-prototype`. Public visibility is confirmed and GitHub Pages activation succeeded. Deployment target: https://sergerprojects.github.io/matchstick/. The Actions workflow publishes the static snapshot when this branch changes.
