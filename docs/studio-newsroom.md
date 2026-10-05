# Matchstick Studio newsroom

The active native automation `publish-matchstick-s-weekly-edition` runs Mondays at 7 a.m. Eastern on the Studio.

The weekly job runs on Chris’s Mac Studio using existing Codex access. No separately billed LLM API, model key, required human editor or approval queue is used.

## Working commands

- `node scripts/collect-news-records.mjs` follows city agenda/minute PDF links, school board packets/minutes and financial/levy documents. It extracts every page with Poppler, uses Tesseract for recent scanned city documents, and preserves date, kind, URL and PDF hash. Full text stays in ignored `.newsroom/` storage. Public `lib/news-coverage.json` exposes successful documents and failures.
- `node scripts/run-newsroom.mjs` reads changed recent records, current financial references and older business/election context. Long packets are divided by pages without truncating their text. It loads the canonical writer and reviewer instructions as Codex developer instructions; source text is lower-priority untrusted input. Tools, hooks, plugins, memory, browsing and delegation are disabled for these application model calls. Each reviewer call starts a fresh ephemeral conversation.
- `node scripts/publish-newsroom.mjs` requires a clean working tree and the expected branch, fast-forwards from GitHub, collects records, runs writing/review, builds the site and commits/pushes only newsroom snapshots. Pages deploys from that push. Unexpected local changes, unavailable Codex or a failed build stop publication.

## Release gate

A candidate needs an affected audience, Wadsworth connection, specific reader benefit, neighbor takeaway, meaningful change and explanation of timeliness. NEWS must describe a development in the last 14 days. EXPLAINER must identify an evidenced consequential decision in the next 30 days; undated background does not acquire today’s date. Usefulness must score at least 2; timeliness at least 1; impact + usefulness + timeliness at least 5.

Every factual assertion in headline, deck, body and structured fields needs an exact source/page excerpt. The publisher matches excerpts against collected text and binds the review to the unchanged candidate and evidence hashes. Every claim ID must receive SUPPORTED from a separate reviewer; PASS with failures or missing claims is rejected. Fluency, a valid source or a meeting title cannot make a candidate eligible. Rejected drafts are held; no fallback publishes them.

PROJECT is a separate dated lookup record. A meaningful earlier development can belong in its history without becoming fresh news. Project locations stay textual when no exact site is established; no guessed map pins or opening dates. Current enrichment is readable original-source excerpts. Arbitrary model-generated embed URLs are not rendered.

`lib/news-snapshot.json` feeds the home, school, project and weekly edition pages. Previous weekly versions are retained in `lib/news-issues.json`; raw drafts/review reports and the incremental ledger remain local. The October 5 bootstrap read six complete record bundles and independently approved a school-tax explainer and the Chick-fil-A access-road milestone. This is operational news publication, separate from the older Convex calendar publisher.

## Browser fallback for school records

When ordinary public HTTP retrieval fails, use the normal browser to open the district’s current-year board archive. Read each recent link and its preceding meeting-date heading. Open those observed resource links and capture the public Finalsite PDF redirect. Save `.newsroom/school-browser-index.json` as `{indexUrl, observedAt, records:[{url,downloadUrl,title,meetingDate}]}`. Dates are ISO dates; indexUrl must exactly match the official current-year archive. The collector accepts this observed index for 36 hours. Never bypass an access-control page, CAPTCHA or paywall. If normal browser access fails too, keep the source gap visible.

## Scope and maintenance

City council/committee documents and school board/financial documents are connected. County meeting minutes, licensed Gazette story feeds, planning-commission archives outside AgendaCenter and private business announcements remain source gaps. County permits and all five legislators’ primary-sponsored bills refresh independently in GitHub Actions each day. Hutson’s currently empty official listing is monitored with a House detail adapter for future bills.

The Studio and Codex app must be available with normal account access and sufficient usage. A stopped job preserves the previous published issue. This schedule is an operating service, not a guarantee that government documents will be timely, complete or available. Held topics include follow-up evidence requests; no required manual weekly review is introduced.
