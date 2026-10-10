# GUMNLY Tech — Brand Kit V1.0

Status: approved visual direction for initial design exploration (10 October 2026). This is a design specification, not a trademark or logo clearance.

## Brand foundation

- Name: GUMNLY Tech; preferred visual wordmark exploration: `gumnly.`
- Business positioning: **SaaS-first technology startup** building its own software products, with **custom software development and system integration** as an additional service line.
- Descriptor: **SaaS Products & Software Engineering**.
- Personality: clear, dependable, contemporary, practical, approachable, technically competent.
- Voice: straightforward Indonesian, specific and verifiable; avoid inflated AI promises, invented results and unverified customer claims.

## Core palette — exactly three brand colours

| Token | Name | Hex | Target visual-area share | Main uses |
|---|---|---|---:|---|
| `--color-deep` | Deep Green | `#0B2F2B` | **5%** | Headings, wordmark, primary CTA, occasional dark section |
| `--color-teal` | Teal Green | `#0F8F73` | **25%** | Highlights, icons, links, outlines, selected UI, illustrative blocks |
| `--color-base` | Warm Neutral | `#EDE8DF` | **70%** | Page backgrounds, large surfaces, cards, spacious negative space |

Percentages describe an **approximate visual balance**, not a mandatory pixel count or a CSS opacity rule. Avoid making every section 25% teal. Deep Green can occupy more area in a deliberately dark product showcase, provided the site remains predominantly light.

No vibrant green, gradients, fourth brand accent, or decorative neon. White and black are not additional brand colours; when strictly adhering to the three-colour identity, use Deep Green for text and Warm Neutral for reversed text. Real photos/screenshots may contain natural colours.

### Accessibility and contrast

- Use Deep Green on Warm Neutral for primary body text.
- Use Warm Neutral on Deep Green for buttons and dark surfaces.
- Teal Green is primarily a graphical/interactive accent; do **not** assume small Teal Green text on Warm Neutral or Warm Neutral text on Teal Green meets WCAG AA without checking actual rendered contrast.
- Test each actual text/background pair to WCAG 2.2 AA: 4.5:1 normal text, 3:1 large text; test UI boundaries and meaningful icons at 3:1.
- Provide visible focus indicators, hover/active states beyond colour alone, and reduced-motion support.

## Typography

- Headings: **Manrope**, weight 600–800.
- Body and UI: **Inter**, weight 400–600.
- Fallback: system sans-serif. Confirm licensing and locally host licensed font files during implementation.
- Avoid overly tight body line height; aim for ~1.5–1.7. Headings can be more compact.

## Logo direction

- Lowercase geometric wordmark `gumnly.` in Deep Green, with a Teal Green dot as an optional brand detail.
- On dark backgrounds, reverse the wordmark to Warm Neutral.
- Monogram and icon are **exploration only**, not approved final logo. Do not reuse or trace the supplied Pinnacle mark, bag graphic, or layout.
- Prepare horizontal wordmark, square favicon, monochrome/reversed variants, SVG source and PNG exports after final approval.

## Web UI rules

- Main background: Warm Neutral; cards can use the same base with borders, spacing, or elevation rather than inventing new brand colours.
- Primary CTA: Deep Green fill with Warm Neutral label.
- Secondary CTA: Deep Green outline or text on Warm Neutral.
- Teal Green: emphasize a word in large headlines, active states, small illustrations, links and meaningful UI indicators.
- Dark feature section: Deep Green background, Warm Neutral text, restrained Teal accents.
- Use solid fills only. No gradients, glowing orbs, heavy glassmorphism or gratuitous animations.
- Layout: editorial hierarchy, clear typography, generous whitespace, mobile-first, selective diagrams rather than repetitive cards.

## Imagery and graphics

- Prefer original product screenshots clearly marked as real or conceptual; original workflow diagrams and simple geometric blocks.
- Avoid generic robot/AI stock art, fake product metrics and fake dashboards presented as actual live product data.
- Reference photo from conversation is **colour inspiration only**, not licensed for reuse as a GUMNLY asset.

## Application boundaries

- Company identity applies across website, presentations and merchandise.
- Individual SaaS products may later have their own subordinate product identities; do not prematurely force every dashboard component to match marketing-site proportions.
- Design tokens should be centralized and reusable across assets.

## Open decisions

- Approve final logo geometry and wordmark; check name/mark clearance.
- Confirm first SaaS product name, scope, release status and approved demo assets.
- Confirm official contact details, verified founder biography, and initial website language.
- Perform contrast checks on implemented components before release.
