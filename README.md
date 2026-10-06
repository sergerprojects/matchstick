# Matchstick

**Boring stuff. With a little spark.** An independent, free public-service publication for Wadsworth, Ohio.

Live site: https://sergerprojects.github.io/matchstick/  
Source: https://github.com/sergerprojects/matchstick

## Current operating model

Next.js 16 and TypeScript export a static site to GitHub Pages. The Mac Studio collects original public documents and uses existing Codex access for original writing and separate editorial review. The public site needs no connection to the Studio, reader account or paid LLM API. The local Convex calendar prototype is retained for development; the Studio newsroom is the current publication path.

- Daily at 6 a.m. Eastern: collect official sources and refresh resident tools.
- Monday at 7 a.m. Eastern: read changed documents, investigate useful leads, write and independently review stories.
- Provisionally every two weeks: freeze a paper when useful approved developments exist. No story quotas or filler editions.
- First full edition: a 90-day catch-up with actual development dates. Review cadence after six weeks of subsequent reporting.

The two native Codex schedules target this project’s Studio task. They depend on the Mac Studio being available; GitHub Pages itself does not run the editorial job. Routine publication requires no approval queue for Chris.

## Publication commands

Use the clean dedicated checkout `/Users/gus/Projects/matchstick-publisher`, branch `matchstick/publisher`:

```sh
node scripts/publish-newsroom.mjs --collect-only
node scripts/publish-newsroom.mjs --catch-up   # first full issue only
node scripts/publish-newsroom.mjs              # incremental editorial run
```

Its ignored `.newsroom` link points to `/Users/gus/Projects/Gus-Chief-of-Staff/state/matchstick-newsroom`. This persistent store holds original PDF/text versions, page extraction, completed reads, facts, held questions and private model runs. Never stage it in the public repository or clear development files to make publication run.

The publisher fast-forwards the expected branch, installs the locked dependencies, collects sources, optionally performs complete reading and editorial work, archives approved stories, builds, commits only public generated exports, pushes to `gus/initial-prototype`, confirms the exact Pages run and checks the live pages. A lock prevents overlapping store writes. Source, model or build failures preserve the published edition; an unconfirmed push is not reported as a successful deployment.

A local compressed recovery copy is written under Gus `state/matchstick-backups`. This is on the same Studio; offsite disaster recovery remains unfinished. Published stories and immutable issues are also retained in GitHub.

## What feeds the reporting

City council and committee documents; school packets, minutes and financial references; county minutes, agendas and resolutions; library board documents; published planning/hearing notices; current first-party Main Street Wadsworth announcements; commercial permits; city service notices; dated county road notices. Ohio and GovInfo supply all five state/federal representatives’ primary-sponsored bills and progress. Full vote history stays on official sites.

The reader processes every required document section before story selection, including sparse scanned pages inside otherwise readable PDFs. Exact excerpts must match their source page. A separate resident-interest pass considers every extracted subject. Original writing then receives full subject facts and source pages; an independent reviewer checks every claim and cited scanned-page images. Held evidence cannot publish through a fallback.

The resident test is specific: would a local business owner, busy parent, prospective mover, casual neighbor or school parent learn something useful? Collection alone does not make news. Actual action, proposal, posting and retrieval dates stay distinct. Agendas do not establish decisions; permits do not establish a business opening; bills do not establish law.

Medina Gazette is a targeted ordinary-browser secondary check, not a broad news scraper. Document its relevant visible reporting in the persistent `gazette-browser-check.json` format and import it with `import-gazette-check.mjs`. Captures are limited to 220 words; original attributed published briefs are limited to 150 words. No full article copying or paywall bypass.

Details: [Studio newsroom](docs/studio-newsroom.md), [coverage and gaps](docs/pipeline-coverage.md), [source access drafts](docs/source-access-requests.md).

The city’s official iCalendar subscriptions supply upcoming dates across month boundaries for a 90-day horizon. Main Street Wadsworth’s advertised event API adds organizer dates and details. All-day and ongoing events remain visible until they end. A calendar entry does not automatically become a news story.

## Reader and archive

- Original reporting, dated project histories, school decisions and resident tools.
- City, school, county, Ohio and federal directory with sourced portraits and verified available social channels.
- Separate sponsored-bill page with progress toward enactment.
- Native commercial-permit information, in-site ward map, calendar details, road notices and supported safety tools.
- Search, topic/date archive filters and browser-local follows.
- Permanent `/stories/<slug>/` pages with dated versions and corrections.
- Immutable `/editions/<slug>/` back issues and a printable latest paper at `/edition/`.
- Evidence in expandable receipts and Sources, rather than source-directory promotions in news slots.

Remaining access/tool work includes complete planning applications/staff reports/outcomes, automatic address-to-ward lookup, a complete city/state disruption feed and comparable crime statistics. County road coverage is not every city street or state route. Registry tools do not create copied person-level registry stories.

## Development

```sh
npm ci
NEXT_PUBLIC_PREVIEW_MODE=static npm run dev
npm run build:pages
```

The development reader uses port 3017. Node 20.9+ is required. Studio document extraction uses installed `pdftotext`, `pdfinfo`, `pdftoppm` and Tesseract; federal bill collection uses Python. Actual model calls use the installed Codex CLI and existing account access. Do not inspect account stores or add API credentials for routine runs.

Pages uses `/matchstick` as its base path and static images. Pushes to `gus/initial-prototype` deploy through GitHub Actions; the daily workflow also refreshes supported resident snapshots. No local backend or credentials are required on a phone.

Canonical operating prompts: [writer](docs/editorial-system-prompt.md), [independent reviewer](docs/editorial-review-prompt.md), [release contract](docs/editorial-contract.md), [inline context](docs/embedded-context-policy.md), and [original voice](docs/voice/VOICE-PROFILE.md). Runtime v5 loads the writer/reviewer voice includes as actual developer instructions; calibration examples are never factual evidence.

## Assets

Brand typography is Libre Caslon Text and Libre Franklin, with OFL licenses under `app/fonts/`. Blue-tip match artwork is in `public/brand/` and `app/icon.svg`. Representative portraits retain provenance in `lib/portrait-sources.json` and the Sources page. No generated documentary portraits are used.

`public/wadsworth-high-school.jpg`: “Wadsworth 7.jpg,” SilentMatt Psychedelic, July 13, 2023, [original](https://commons.wikimedia.org/wiki/File:Wadsworth_7.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The UI displays the source in cropped frames with credit; cropped adaptations retain that license.
