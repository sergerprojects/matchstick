# Official document coverage

Connected October 5, 2026:

- City AgendaCenter: council and published committee PDFs; agenda/minutes distinguished by contents during reading. Six-month discovery window supports late-posted outcomes; all scanned PDFs are OCR eligible.
- School current-year board archive: full trailing 90 days, including July 20 special/regular supporting packets and approved minutes; current district financial references.
- County commissioners: observed paginated minutes and resolutions archives, actual original PDF attachments, current-year agenda archive. Draft resolutions retain draft status.
- Planning and council public-hearing notices: published PDFs. **Incomplete:** the pages do not provide a full application/staff-report/disposition archive. A schedule is not counted as that feed.
- Library: every publicly linked board PDF, with dates resolved from document content during reading.
- County commercial permits: supported report date parameters, trailing 90 days, WADSWORTH CITY rows only. Separate township records excluded. Permit scope never establishes opening or tenant.
- City digital newsroom service notices: actual notice pages, not promotional newsroom links.
- County roads: published dated closure entries, retained bulletin validity; reader display expires individual notices.
- Ohio and GovInfo bill feeds: five primary-sponsored-bill lists remain connected. No full vote-history import.

Pending supported access: complete planning applications/staff reports/outcomes, ODOT current closures and live city utility notices beyond the public digital newsroom. Public Safety packet reading is connected; native comparable statistical series needs reviewed definitions/periods before export.

## Recoverability

Raw PDF/text versions are keyed by SHA-256 under the ignored persistent store. Reading chunks have immutable version/hash keys; failed chunks do not count as complete. Fact inventory records every required chunk. Model output remains local. Public exports contain approved prose and necessary evidence only.

A separate publisher checkout must run with its own branch and a symlink to the persistent document store. A create-exclusive lock prevents simultaneous mutation; after an interrupted job confirm its recorded PID is no longer running before removing the lock. Never clear a lock or checkout automatically while another process may be using it.

Daily collection also maintains city/school calendar dates. A weekly ordinary-browser Gazette check supplies bounded, attributed public reporting through `import-gazette-check.mjs`; inaccessible reporting is a coverage gap.

Git tracks approved stories, their versions, selected immutable editions and public coverage. This backs up published work remotely. `backup-newsroom.mjs` saves compressed source versions, reader checkpoints, working ledgers and run records to the ignored Gus `state/matchstick-backups` directory after completed collection/editorial work. This is a separate local recovery copy on the same Mac; offsite disaster recovery remains a gap.
