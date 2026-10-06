# Matchstick Studio newsroom

## Operating sequence

The Mac Studio uses existing Codex access. No separate LLM API billing or routine approval queue for Chris.

1. `collect-resident-tools.mjs` and `collect-federal-bills.py`: official 90-day commercial permits and all five primary-sponsored-bill feeds.
2. `collect-news-records.mjs`: city/committee packets, all trailing 90-day school meetings, financial references, county minutes/agendas/resolutions, library attachments, planning/hearing notices. Every PDF is eligible for OCR. Discovery rechecks older city records for late outcomes and revisions.
3. `collect-service-records.mjs`: supported permit facts, city service notices and dated county road bulletin.
4. `extract-news-facts.mjs`: reads every page/section, checkpoints the reader by document version, and validates exact page-linked facts. A partial packet cannot reach writing until all its sections have completed. Model failures remain retryable. Whole-document facts are reconciled by subject before selection.
5. `run-newsroom.mjs`: an accountable resident-interest pass considers every extracted subject, records its routing, and sends worthwhile subjects with full facts and original pages to writer v5, then a separate ephemeral reviewer v5 checks the copy and every claim. Changed/held subjects remain reconsiderable; no destructive bootstrap reset. `--catch-up` explicitly uses 90 days and keeps actual development dates.
6. `save-news-archive.mjs`: permanent reviewed stories and versions. `--edition` or `--catch-up` freezes selected versions into an immutable paper; an unchanged or empty selection does not invent a new issue.
7. `publish-newsroom.mjs`: dedicated clean publisher checkout, collection, optionally editorial reading/writing, compilation, scoped generated-file commit, push, bounded Pages confirmation and live archive/story availability checks. `--collect-only` skips model calls. Default editorial mode updates stories and issues a paper only when fourteen days have elapsed and useful approved changes exist.

## Frequency

Daily source collection; Monday editorial check; provisional paper every two weeks. Time-sensitive notices expire automatically. No minimum story count or filler. Revisit cadence after the catch-up and six weeks of actual useful reporting; initial historical backlog is not evidence of weekly future story volume.

## Storage and recovery

The dedicated publisher’s ignored `.newsroom` symlink points to persistent Studio storage. That storage contains raw versions, complete-reader checkpoints, facts, held decisions, run output and deployment status. Public exports contain approved text, necessary official quotations and coverage metadata only. Publisher uses `/Users/gus/Projects/matchstick-publisher` on `matchstick/publisher`, sharing that persistent store; development files must never be cleared to make automation run.

Collection and publication have different success records. A push alone is not success. Source failures remain in coverage even if the site build succeeds. Original approved content survives failed retrieval/model/build; failed pushes preserve their commit. A create-exclusive lock prevents simultaneous collection/editorial writes; investigate an interrupted run's recorded PID before removing its stale lock.

Exact quotes and same-candidate separate PASS remain required. Dates are not substituted with retrieval time. Agendas, permits and bill introductions do not establish approval, opening or law. Humor is optional and reviewed, including implied facts. Read canonical editorial-system-prompt.md, editorial-review-prompt.md, editorial-contract.md and embedded-context-policy.md before changing selection or publication.

## Actual boundaries

See pipeline-coverage.md. Planning notices are connected, but the complete planning application/staff-report/disposition archive remains unresolved. Gazette is a targeted secondary-check requirement, not a broad scraper; ordinary-browser lead import is connected through `gazette-browser-check.json` and `import-gazette-check.mjs`; a fresh weekly browser check remains required. Native comparable crime statistics and automated address-to-ward matching remain work. County road notices are not a complete city/state disruption feed.

School normal HTTP currently works. If it fails, a normal browser can supply the observed current-year resource links and public Finalsite redirects in `school-browser-index.json`, valid for 36 hours. Never bypass access controls. Preserve gaps when public browser access also fails.

## Original voice loading

Both actual CLI developer instructions consume `docs/voice/VOICE-PROFILE.md`. The writer also consumes `WRITER-VOICE-INCLUDE.md`; the independent reviewer consumes `REVIEWER-VOICE-INCLUDE.md`. Canonical editorial prompts are version 5. Synthetic calibration examples never enter source evidence. Existing approved text is not automatically rewritten for style.

Gazette visible source captures are limited to 220 words per report; original attributed published briefs are limited to 150 words. Gazette evidence excerpts remain private rather than being republished in receipts. No paywall bypass or full-article copying.

Collected PDF pages cited by a candidate are rendered directly from the content-addressed original PDF and attached to its independent reviewer. Amounts, dates and table columns are checked against those page images as well as the extracted text; source PDF and extracted-text hashes are retained separately.

## Gazette browser-check format

Save the targeted ordinary-browser observation to `.newsroom/gazette-browser-check.json` before the editorial publisher. Required JSON fields:

```json
{
  "checkedAt": "actual current ISO timestamp",
  "indexUrl": "exact observed Gazette index URL",
  "access": "brief description of ordinary visible access",
  "items": [{
    "url": "exact https://medina-gazette.com/news/ article URL",
    "title": "actual article title",
    "author": "actual named reporter",
    "publishedAt": "actual article publication timestamp",
    "eventDate": "actual reported event date in YYYY-MM-DD, or empty string",
    "publicContext": "At most 220 words of useful visible reporting, preserving proposal versus outcome and relevant attribution."
  }]
}
```

This is a format example, not source evidence. If a successful targeted check finds no relevant new report, `items` may be empty; it does not establish exhaustive Gazette coverage. If access fails, retain the last observation rather than fabricating a fresh check. The importer expires checks after eight days. Do not copy an entire article. Inspect the reader’s subsequent HOLD questions for missing underlying official records.

The independent reviewer receives the verified complete-reading inventory and reconciled subject facts, alongside candidate-linked pages and adjacent context. The complete-reading gate still checks every required current source/text version before writing. Selected review pages are not mislabeled as unread whole packets; bounded publisher excerpts retain their explicit scope. Every cited collected PDF page is attached as an original page image. Correctable copy/optional metadata defects may return REVISE for repair and fresh review; genuine missing core facts remain HOLD.
