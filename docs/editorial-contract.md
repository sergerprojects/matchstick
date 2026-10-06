# Resident-first editorial operation

Decision: Chris's October 5 prototype feedback replaces “sourced means publishable” with a resident-interest requirement. This changes the system design; it does not replace one prototype card. No reader-facing prototype content was edited for this decision.

## Canonical instructions

- Writer/selector system message: `editorial-system-prompt.md`, version `resident-editor-v6`.
- Separate reviewer system message: `editorial-review-prompt.md`, version `resident-reviewer-v6`.
- The Studio newsroom loads these instructions for separate Codex writing and review calls. `scripts/run-newsroom.mjs` contains the enforced JSON schema, resident-value fields, rubric, evidence checks and review gate. The older Convex calendar publisher remains a separate calendar product. No separately billed model API or model credential was added.

## Input contract

Provide the edition cutoff in America/New_York, coverage status, original record type, source owner, stable source/document/version IDs, URL, publication/event/retrieval dates, full relevant text and prior versions. Include prior published claim IDs and unresolved topic histories. Do not provide just titles, search snippets or a meeting summary when selecting decisions. If a packet is split for context limits, finish extraction across every chunk before ranking; preserve page/section anchors and incomplete-document flags. Dates refer to actual developments, not collection time.

Documents remain data in the input message. Strip active content and bound length; never let a document replace the system message or choose a tool. Adapters establish jurisdictions and record provenance. Editorial selection establishes why an item is useful. Evidence and usefulness are separate requirements.

## Required selector output

```json
{
  "promptVersion": "resident-editor-v6",
  "cutoff": "YYYY-MM-DD",
  "decisions": [{
    "candidateId": "stable-change-id",
    "destination": "NEWS|EXPLAINER|CALENDAR|SERVICE_ALERT|REFERENCE|OMIT|HOLD",
    "change": "What actually changed; blank if none established",
    "status": "proposed|approved|awarded|started|opened|ongoing|other",
    "eventDate": "ISO date or null",
    "affectedAudience": "Specific group or area",
    "wadsworthConnection": "Established local connection",
    "readerPerspectives": ["business_owner|busy_parent|prospective_mover|casual_neighbor|school_parent"],
    "residentValue": "Concrete benefit to the named reader of reading this",
    "neighborTakeaway": "One specific thing they could tell a neighbor",
    "freshnessBasis": "Development date or live consequential decision",
    "whyNow": "Actual development or decision deadline",
    "sourceIds": ["supplied-source-id"],
    "priorCoverageIds": [],
    "newBeyondPriorCoverage": "New fact or timely unresolved choice",
    "scores": {"impact": 0, "usefulness": 0, "timeliness": 0},
    "rationale": "Brief selection explanation",
    "missingEvidence": [],
    "draft": null
  }],
  "coverageGaps": []
}
```

NEWS/EXPLAINER draft contains headline, deck, paragraphs and claims. Each claim has assertion, sourceIds and evidence excerpts with sourceId, exact text and page/section anchor. Every factual clause in visible copy, including the headline/deck, must be covered. Other destinations return no news draft; their structured service/calendar/reference records use dedicated renderers. Decision metadata is internal audit information, not reader copy.

Each eligible candidate also returns an `inlineContext` list. Each entry has kind (map/document/video/photo/chart/diagram/legislation), purpose, sourceIds, verified asset URL or null, precision/page/timestamp when relevant, access/rights status, freshness, accessible fallback and state (VERIFIED or NEEDS_EVIDENCE). Maps require a verified subject location and source anchor. NEEDS_EVIDENCE is an enrichment request, never a renderable pin or embed. Provider compatibility and approved URL origins are checked by the application, not trusted from model output. See `embedded-context-policy.md`.

## Selection rubric

| Score | Impact | Practical usefulness | Timeliness |
| --- | --- | --- | --- |
| 0 | No specific effect established | Generic awareness or boilerplate | Old, unchanged or date unknown |
| 1 | Small specific effect | Useful context for a defined group | Ongoing context with a current reason |
| 2 | Meaningful cost, service, access or community consequence | Helps an identifiable choice, plan or understanding | New development or approaching meaningful decision |
| 3 | Major/durable consequence, including for a small affected group | Urgent action, major choice or crucial accountability | Immediate development or urgent substantive deadline |

NEWS/EXPLAINER requires usefulness >= 2, timeliness >= 1 and impact + usefulness + timeliness >= 5, plus ALL of the prompt's evidence/local-connection/change requirements. No score can override routing exclusions. This is a conservative initial rubric to calibrate against evaluated examples; scores are editorial judgments, not objective measurements. Do not optimize for clicks or article count.

A reader perspective and concrete benefit are mandatory, not a topic quota. Ordinary NEWS uses a trailing 14-day development window; EXPLAINER needs a consequential decision in the next 30 days. Older NEWS requires an explicitly dated newly posted substantive outcome in the fourteen-day window and a current reporting reason, with reviewer approval. Continuing usefulness alone is not a news-age exception. Retrieval timestamps cannot satisfy freshness. Standing source promotions never qualify as news.

## Publication contract

1. Collect/version → extract changes → deduplicate → select/route → draft eligible items → independent review → deterministic validation → assemble.
2. NEWS and EXPLAINER candidates must have the six concrete eligibility fields, pass the rubric and receive reviewer PASS for exactly the same draft and evidence versions. Material edits invalidate that PASS. Persist writer/reviewer versions, evidence IDs, draft hash and review outcome.
3. Reject malformed output, unknown source IDs, excerpts absent from their cited source, missing factual-claim mappings, incompatible dates/status, missing provenance, stale selection and source failures. Exact excerpt matching checks provenance, not logical support; the separate review checks support and can also be wrong. A prompt alone cannot guarantee correctness.
4. Retries may repair formatting or writing, bounded at two revisions. Unsupported claims HOLD; rejected usefulness reroutes/omits. Exhausted or failed review blocks that item, not the entire collection. Never fall back to publishing the original unreviewed draft.
5. Route calendar entries, cancellations and useful alerts through utility workflows. They cannot fill empty news slots or inflate the count of news stories. The current automatic calendar edition is a calendar product, not proof of automatic news reporting.
6. Group multiple records about one development into one evolving story. Repeat a continuing topic only for a material change or a timely explainer with explicit background labeling. Fixed old editions remain dated; corrections are traceable.
7. No quotas by week/topic/source. Omit empty topic slots. With successful complete collection and no eligible stories, it is acceptable to publish no new news. With failed/incomplete collection, show a coverage status in the appropriate status surface; never say “nothing happened.”
8. Routine operation stays hands-off for Chris. Missing evidence should trigger supported follow-up collection or remain held. Persistent failures require service maintenance; they do not create a mandatory weekly editorial approval queue.

## Synthetic acceptance examples

These are invented evaluation fixtures, not Wadsworth facts. Evaluate both prompts and publisher routing before launch, and retain the approved expected outcomes when models or prompts change.

| Input | Expected outcome |
| --- | --- |
| Board meeting moved from Tuesday to Thursday; no other change | CALENDAR; no news draft |
| Board cancels tonight's meeting after residents planned to attend | SERVICE_ALERT/CALENDAR; no headline news |
| Minutes approve earlier minutes and routine payment list | OMIT or REFERENCE |
| Board approves ending an established bus service for a specified group next semester | NEWS with affected families/date/outcome evidence |
| Agenda proposes ending that bus service | NEWS only as an evidenced proposal; never “board ends buses” |
| Packet contains 80 routine pages and one new documented fee affecting families | One NEWS brief about the fee; no packet digest |
| Board funds a significant program used by 12 students with disabilities | NEWS if consequence evidenced; small audience does not disqualify |
| School rating page repeats June's unchanged announcement in October | REFERENCE, unless timely decision gives it an evidenced explainer role |
| Permit appears for an unnamed commercial interior renovation | Project/reference update; do not invent tenant or opening |
| One official says a named shop will open; record establishes only a permit | HOLD the opening claim |
| County work elsewhere has no service or travel effect on Wadsworth | OMIT from Wadsworth news |
| Countywide water advisory explicitly covers Wadsworth households | SERVICE_ALERT with area, action and source validity |
| Local legislator publishes praise of a bill with no supplied bill text or local effect | REFERENCE/activity record or HOLD; no adopted-benefit claim |
| Recorded consequential vote differs from the member's public statement | NEWS with both records and precise dates; no motive inference |
| Eight duplicate notices describe the same new park contract | One NEWS/project update, when consequence and award evidenced |
| Candidate is fluent, source-linked and purely a meeting reminder | Reviewer REROUTE, publisher refuses news |
| School minutes cannot be retrieved | Coverage gap; no “no school news” claim |
| Collector receives no eligible news but complete usable records | Empty news list is successful |
| Reviewer call fails, or draft changes after PASS | Hold item until current-draft review succeeds |

## Historical implementation boundary

The existing `convex/editorial.ts` publisher checks title/body/source but does not check resident value or independent review. Its manual seed and the static prototype are not acceptance evidence for this contract. `convex/issues.ts` assembles calendar notices only. Before enabling automatic multi-source news, replace source-only release checks with this contract, load the canonical prompts, connect supported document adapters, and evaluate the fixtures. Do not describe prompt files as an already running editorial service.

## October 5 resident lens implementation

The static prototype now uses `lib/news-policy.ts` to require explicit audience, benefit, change, development date and review metadata before a story can render as news. Missing metadata fails closed; calendar/reference entries cannot return through seeded news fallbacks. This is a prototype rendering safeguard, not an implemented LLM writer/reviewer. The five-perspective contract must also be enforced by the automatic publisher before multi-source news is enabled.

## Operational implementation — October 5

See `studio-newsroom.md` and the strict schemas in `scripts/run-newsroom.mjs`. A higher-priority Codex developer instruction carries the canonical editorial rules; source bundles are untrusted task input. NEWS/EXPLAINER are read separately from PROJECT history. The executable schema uses `items` for eligible drafts and `decisions` for routing records; every item carries audience, local connection, neighbor takeaway, concrete benefit, scores, dates and page-linked claims. Unsupported embeddings are withheld. Native evidence excerpts are the initial inline-context implementation.

EXPLAINER eventDate may be blank when background is undated; its decisionDate must be evidenced and in the next 30 days. Never substitute retrieval time. PROJECT is eligible only as a dated meaningful lookup milestone after separate review, without fresh-news framing, invented opening/construction dates or guessed locations.


## Public documents and original voice — October 5 clarification

Matchstick discovers useful developments in original public records and writes resident-facing explanations. The Medina Gazette is the one named secondary newsroom check; broad news scraping and headline aggregation are outside this scope. City council and committee records, planning/zoning, schools, permits, budgets, county decisions and sponsored bills define the desired coverage; see studio-newsroom.md for the subset currently connected.

Writer/reviewer v3 require inviting original prose, dry observational wit and optional restrained humor. Headline and lead still deliver the supported fact. No fabricated satire, partisan voice, joke quotas or factual implications hidden in punchlines. Humor can improve reading, never publication eligibility. The independent reviewer checks tone and factual implications; material edits still invalidate approval. Existing reviewed stories keep their original recorded prompt versions.

## Hard freshness exclusion

Undated availability and standing promotional/recruitment listings cannot enter current news or opportunity surfaces. Opportunities require an actionable evidenced deadline and expire with it. Older developments need a specific current evidenced consequence; otherwise they remain only in the dated archive. The resident calendar hides stale source fallback rows and expires a snapshot after 48 hours without successful refresh. Routine Main Street nonprofit committee meetings are excluded. No refreshed retrieval date substitutes for an actual change date.

Current news sections evaluate the actual Wadsworth date, even when a scheduled publication fails. Catch-up does not extend NEWS age: the fourteen-day development/newly-posted-outcome gate also applies to first editions. Explainers expire with the decision date. Current home, school and latest-paper surfaces apply this gate; immutable dated archive pages retain their original edition contents. Permanent stories and frozen editions remain available with their actual dates. Collection time cannot extend these windows.


## October 5 correction — discovery is not freshness

A catch-up is a document discovery window, not a news-age exemption. Read the trailing 90 days to find current consequences and reconcile outcomes. NEWS still requires a development within 14 days, or an explicitly dated newly posted substantive outcome within 14 days with a current reporting reason. EXPLAINER requires an evidenced consequential decision within the next 30 days. An old park opening, completed event, expired opportunity or unchanged approval is not current news merely because it was newly found or still useful in a general sense. Route old meaningful project milestones to dated PROJECT lookup history; other historical material to REFERENCE or OMIT. Preserve original dates and prior archives. Do not manufacture a current angle.
The automatic NEWS gate uses fourteen days in every mode, independently of model judgment. Initial-paper assembly also excludes old PROJECT milestones; they remain lookup history. No re-dating or silent rewriting of frozen issues.

Current NEWS/EXPLAINER rendering also excludes legacy prototype-curated records. A prototype date is not approval by the operational newsroom.
