# Framer fidelity correction handoff

## Delivered
- Live preview refreshed: https://rawrc.mtex.my.id (HTTP 200), only GUMNLY port 37921 restarted. PID 1809045 serves `.next-fidelity-live`; old process environment was copied unchanged except `QA_DISTDIR`. Existing `.env` and `data/` were not edited. QA port 37922 stopped after verification. No commit or push.
- Public homepage, subpages, navigation, metadata, consent, privacy, product status and form feedback use English. `src/public-copy.ts` translates exact original seeded content at presentation time and preserves all administrator edits and DB records.
- Ordinary card rules now 1px #e0e2e6; paper #ede8df, body #44454c; secondary CTA #edeef1 with #c9cdd2 rule. Advantage cards equal height, with no desktop stagger. Narrow cards no longer exceed their container. Phone expertise is one column, 272px high with 20px padding; desktop wide feature cells retained.
- Hero matches desktop reference size, position, typography, photo and CTA structure. Tablet and mobile CTAs are content-width, not stretched.

## Actual QA
- `npm test`: 27 passed, 0 failed.
- `QA_DISTDIR=.next-fidelity-live APP_ORIGIN=https://rawrc.mtex.my.id npm run typecheck`: passed.
- Same isolated dist build: passed. Existing Turbopack warning: dynamic filesystem access in src/server/config.ts traces the project. No backend/config edits made to suppress it.
- Public-preview browser checks: 1440, 834, 390, 320; no page errors, no clipped tested card/button/FAQ/hero rectangles, equal benefits, working FAQ open/close, service click/keyboard, mobile/tablet menu Escape, reduced-motion ticker, images loaded.
- Public routes /, /about, /products, /services, /contact, /privacy, /admin/login return 200; unauthenticated /api/admin/company returns 401.
- Subpage browser QA at all four widths passed on isolated production server. Product filters, tabs, menus, reduced motion passed. Real contact submission created one enquiry in the isolated QA SQLite DB; readback delivery=`stored`. Production enquiry data was not touched.
- Red evidence: browser test initially failed on wrong border color, unequal heights and 320px clipping; English UI unit expectations failed before translations.
- `git diff --check`: clean. Generated tsconfig changes restored after build.

## Measured comparison (CSS px)
| Width | Live hero | Reference hero | Live advantages (all three) |
|---|---|---|---|
|1440|1152×712|1152×712|373.33×434|
|834|786×728|786×728|786×410|
|390|358×1073|358×1072|358×420|
|320|288×1169|288×1144|288×470|

H1: 72/72 desktop, 64/64 tablet, 48/48 phone. Section headings 36/48. Reference measured card fill rgb(237,232,223), radius16, ::after border1px rgb(224,226,230), body16/24 rgb(68,69,76). Live uses ordinary CSS borders with matching visible thickness/color. Equal heights intentionally override the reference's varying content-driven heights.

## Remaining differences / do not claim pixel parity
- Narrow hero is 25px taller (phone 390 differs 1px), allowing honest statistic labels to wrap rather than clip.
- Advantage illustrations remain the existing semantic reconstructions, not exact replicas of the Framer UI-kit/chart animations. Existing service layer illustrations and several decorative icons are approximations.
- Capability ticker replaces fabricated client logos; proof counts use real product/service/process facts rather than reference customer metrics/testimonials.
- Public copy is deliberately shorter in several sections; section heights therefore differ. Gallery provenance remains explicit. Navigation maps real GUMNLY routes, not nonexistent Articles.
- Background diagonal texture and secondary decorative surfaces remain approximate; main measured surface/text/rule tokens were matched. No exact pixel-difference score claimed.
- Arbitrary future administrator-authored non-English content is preserved, not automatically translated.

## Evidence and changed files
- Before/reference: `docs/fidelity-evidence/{reference,gumnly}-*-{hero,full}.png`, `measurements.json`, `reference-details.json`, `check-before.json`.
- Final public screenshots and geometry: `docs/fidelity-evidence/live/`; interactions: `live-interactions/qa-results.json`. Subpage screenshots/results: `pages/`. Logs in the same evidence directory are locally retained (gitignored).
- Updated UI: app/page.tsx, app/home.css, app/pages.css, app/{about,products,services,contact,privacy}/page.tsx, app/layout.tsx; components/{home-motion,contact-form,product-gallery,site}.tsx and contact-logic.ts.
- Added src/public-copy.ts and tests/public-copy.test.ts; updated homepage/pages/contact tests.
- Added scripts/fidelity-{audit,check,geometry}.py and reference-detail.py; updated homepage-qa.py and pages-qa.py; .gitignore excludes isolated fidelity builds.
- Planning: docs/FIDELITY-PLAN.md. Working tree intentionally uncommitted for review.
