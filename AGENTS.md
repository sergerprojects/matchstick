<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Matchstick project rules

- Independent Wadsworth public-service hub. Discover useful developments in original public documents and write original, lively resident explanations with restrained observational humor. The Medina Gazette is a secondary check; broad news scraping and headline aggregation are outside scope. Original sources directly; no MyTownView integration.
- Routine collection, explanations and weekly publication must be hands-off for Chris. Do not introduce a required human review queue as the default workflow.
- Every factual item needs source owner, original URL, event/reporting period and retrieval/verification dates. Unknown or failed collection is not zero activity.
- Do not infer decisions from agendas, openings from permits, wards from ZIP codes or guilt from incident reports.
- Maintain the original editorial design. No generic SaaS layout or invented current news/metrics. Documentary photographs must be accurate and licensed.
- Local code and compilation are authorized. Remote pushes, public deployment and new remote infrastructure require scoped user authorization.
- Never read or reuse another project's secrets, credentials, tokens or Keychain items. Fresh exact approval is required for credential work.
- The Studio newsroom uses existing Codex access with separate writer/reviewer application calls. No separately billed LLM API or model credentials are configured. See docs/studio-newsroom.md for the enforced release gate and coverage limits.

## Editorial operation

Before changing source-to-story generation, news publication, topic selection or story enrichment, read `docs/editorial-system-prompt.md`, `docs/editorial-review-prompt.md`, `docs/editorial-contract.md` and `docs/embedded-context-policy.md`. These are the canonical resident-first requirements. A valid source alone is not publication eligibility. Routine meeting notices belong in calendar/service workflows. Do not fill topic or edition quotas. Explain the concrete local consequence and require an independent review before automatic news release.

Plan useful inline context for eligible stories; place stories should have source-backed location pins. Do not substitute a generic city map for a verified subject locator. Prefer useful in-site explanations and supported context over mandatory external clicks. Prototype examples, seed routines and calendar assembly are not proof that these editorial gates are implemented. Never claim prompt files are a running news service.
