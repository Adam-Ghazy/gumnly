# GUMNLY — Website & asset brief

Status: preparation; no website built or published yet.
Domain: gumnly.tech (owned by founder; DNS activation not verified).

## Purpose
Company website for Indonesian business software, document automation, HR workflows and system integration. HR SaaS is a first product, not the whole company. Primary conversion: request a discovery conversation or demo. Secondary: understand capabilities and view honestly labelled product demonstrations.

## Initial sitemap
- Home: concrete problem, value proposition, illustrative workflow, services, product status, contact CTA.
- Solutions: HR workflows and document processing, with input/output and human approval steps.
- Services: custom software, workflow automation, integration.
- Products: one initial HR product; explicitly in development until actually demonstrated.
- About: founder-led company; verified biography only.
- Contact: validated form, spam control, delivery destination to be configured.
- Privacy: actual data collection/retention, completed before public form launch.

## Proposed copy
Headline: Kurangi kerja administratif. Rapikan alur bisnis.
Support: GUMNLY membangun software dan otomasi AI untuk menghubungkan dokumen, persetujuan, dan sistem yang tim Anda gunakan.
CTA: Diskusikan kebutuhan Anda.
No fictional testimonials, customer counts, performance multipliers or client logos. Prior internship/rebuild work must be identified accurately; no implication of customer endorsement.

## Proposed visual direction — pending brand decision
Editorial, practical and precise. Warm paper background, charcoal typography, restrained deep-teal accent. Strong typographic hierarchy; asymmetric sections with deliberate spacing rather than repeated card grids. Proposed fonts: Manrope headings, IBM Plex Sans body; verify available fonts and licences when implementing.
Avoid: purple-blue AI gradients, glowing orbs, generic robots, stock dashboard collage, decorative bento overload, unnecessary scroll animation, vague superlatives.
Mobile-first; visible focus states, readable contrast, reduced-motion support.

## Original Moda asset inventory
- Original GUMNLY wordmark/monogram exploration (draft, not claimed trademark-cleared).
- Document-to-review-to-approval hero workflow illustration.
- Two supporting diagrams: HR workflow and structured document extraction.
- Open Graph composition and favicon derived from approved mark.
- Editable source canvas URLs, exported web assets, provenance and export manifest.
No external reference logos/illustrations copied. Standard UI icons may use a licensed official library; brand/hero graphics are custom.

## Technical proposal
Next.js + TypeScript. Minimal client JavaScript. Static-first public pages; no unnecessary application database for the marketing site. Component tokens for colour/spacing/type. Responsive images and locally served licensed fonts. SEO metadata, sitemap, robots, semantic HTML.
Contact endpoint must include validation, rate limiting/spam protection and a verified delivery destination; no fake success state. Email hosting and DNS routing are a separate prerequisite, not a reason to delay local page development.

## Verification before release
Build and type checks; desktop/mobile visual review; keyboard and contrast review; working navigation; real contact delivery test; no placeholder links or unsupported business claims; actual HTTPS and public-domain checks after explicit deployment decision.

## Current Moda status
OAuth succeeded and moda_bootstrap executed via Hermes native MCP client from Python. Workspace has an existing Mtex brand kit; do not overwrite or automatically reuse it for GUMNLY. Deterministic canvas authoring is available without generation credits. No GUMNLY brand kit or canvas created yet.

## Decisions still needed
Approve new GUMNLY brand direction (or specify colours). Founder-approved public contact details; factual About information; whether Indonesian-only initial release is acceptable (proposed default: Indonesian). Name for first product remains provisional.
