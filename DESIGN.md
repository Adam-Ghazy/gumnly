# GUMNLY visual authority
Source: docs/GUMNLY-BRAND-KIT.md and docs/WEBSITE-BRIEF-UPDATED.md.
Three solid colors only: Warm Neutral #EDE8DF (dominant ~70%), Teal Green #0F8F73 (graphic ~25%), Deep Green #0B2F2B (text, primary actions ~5%). No gradients, opacity-generated extra colors, white/black, emoji, glassmorphism, generic SaaS metric dashboards. Small text uses Deep Green on Neutral; reversed text Neutral on Deep Green. Teal for large display or graphical accents; validate contrast.
Manrope 600–800 headings, Inter 400–600 body, locally hosted licensed WOFF2. Editorial broad margin layout, oversized company-level title, split hero with original supplied brand illustration slot, ruled section dividers, restrained square/soft corners, asymmetric product presentation. Accessible skip link, visible keyboard focus, reduced motion, mobile navigation. Public nav: Beranda, Produk, Layanan, Tentang, Kontak. Indonesian copy, in-development product, no fabricated customer/testimonial/metrics. Dashboard is utility-oriented content administration with sidebar, actual data counts, empty states, validation, save feedback.
Parent owns public/brand originals; reference existing files without modifying. If not yet present use honest concept structure/fallback, never claim made in Moda.

## Implemented layout system (October 2026 redesign)

Tokens in `app/globals.css`: section padding `clamp(4.5rem, 11vw, 8.5rem)`, rule tokens derived from the three brand colours only. Type scale: h1 `clamp(2.9rem, 7.2vw, 5.3rem)` Manrope 800, h2 `clamp(2.05rem, 4.6vw, 3.2rem)`, h3 1.45rem; body Inter 1.0625rem/1.65.

Patterns: full-width typographic hero (headline as statement, split copy/illustration below, ruled meta strip); dark product band using ledger rows (`.rule-list`) instead of cards; capability columns via `.col-rule` (teal top rule, no card boxes); numbered process steps (`.steps`, 4-col on desktop); dark CTA bands; dark footer with text wordmark `gumnly.` (teal dot) because the supplied wordmark PNG is opaque cream and cannot sit on dark backgrounds. All cards removed from marketing surfaces. Zero-JS checkbox mobile nav. One radius system: 8px controls, 999px status pill only.
