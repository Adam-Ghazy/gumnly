# GUMNLY asset manifest

## Provenance and status

Original artwork authored directly through Moda MCP deterministic canvas tools, not delegated to Moda's agent. All requested assets have real editable Moda canvases and actual downloaded Moda PNG and non-flattened PDF exports. No website was published. Wordmark remains an exploration, not final logo approval or trademark clearance.

Brand kit: **GUMNLY Tech**, `bk_5PC2MT0FB99NFVBM473ZPYGQV9` — https://moda.app/brand-kit/b660a9a0-3d69-4d5f-b5d0-871fede85f69

Created separately from Mtex; Mtex remains the default and was not edited. GUMNLY kit was read back and each canvas explicitly bound to it. Canvas visibility is team, at drive root.

Palette: `#EDE8DF` / `#0F8F73` / `#0B2F2B`. Solid fills only; no gradients, stock imagery, traced external marks, fabricated metrics or live dashboards. Typography: Manrope headings/wordmark and Inter supporting text.

## Deliverables

All paths below are relative to `public/brand/`.

| Asset | Actual PNG export | PNG pixels | Other actual export | Editable canvas |
|---|---|---|---|---|
| Lowercase wordmark exploration | `wordmark.png` | 1440 × 480 | `wordmark.pdf` | https://moda.app/canvas/1e3e425d-3141-466c-971f-76c935b65de4 |
| Company-level SaaS illustration | `hero.png` | 2000 × 1800 | `hero.pdf` | https://moda.app/canvas/956f086f-99fd-4ca5-b1d8-f77c3a6d6e24 |
| Services workflow | `workflow.png` | 2400 × 1120 | `workflow.pdf` | https://moda.app/canvas/72210495-6cf2-4098-93e0-5a3edfdea9db |

Canvas IDs, respectively:
- `cvs_0Y7S15TCA18SP9E7VPS4TVCQF4`
- `cvs_4NDW46Z6FX9JJV3P7QFGX6TVH4`
- `cvs_3J4429AV7J82C97R2T7VFXXAEV`

PNG exports use pixel ratio 2 and a Warm Neutral background (not transparent). PDF exports were requested with `flatten=false`. Native SVG is **not** supported by the current Moda export schema; no local SVG is represented as a Moda export.

## Editable sources and verification

- `wordmark.moda.xml`, `hero.moda.xml`, `workflow.moda.xml`: authoring markup, not SVG.
- `workflow-arrows.moda.xml`: final appended directional arrows. Initial named connectors did not render; explicit editable line arrows replaced that intent. For re-authoring, omit the initial connector tags and append this file after the base workflow markup.
- `wordmark.moda-readback.txt`, `hero.moda-readback.txt`, `workflow.moda-readback.txt`: final remote readbacks, including actual editable text, shape geometry and revision tokens. The live canvas and these snapshots are authoritative.
- `export-verification.json`: downloaded file byte sizes, SHA-256 hashes and verified PNG dimensions.
- All three canvases were read back after authoring. Moda screenshots were inspected using the visual tool: full wordmark legible; hero labels and geometry unclipped; final workflow arrows visible with consistent title size and no clipping.
- Workflow's initially auto-shrunk fourth heading was repaired to `Review` at 27 px; supporting copy now reads `Uji, iterasi & perbaikan`.
- All six downloads returned successfully. PNGs were decoded/verified with Pillow; PDF signatures were checked.

## Usage

- Wordmark alt text: `GUMNLY`.
- Hero alt text: `Ilustrasi konseptual produk SaaS yang terhubung dengan otomasi dan integrasi.`
- Workflow alt text: `Discovery, desain, pengembangan, lalu review dan iterasi; pendekatan disesuaikan dengan kebutuhan proyek.`
- Hero explicitly says it is a conceptual illustration, not a product interface. Product availability is not claimed.
- At small mobile sizes, provide the workflow stages as accessible HTML text rather than relying solely on small text inside the raster image.
- Final logo approval, favicon/reversed variants, first-product demo imagery and social/OG assets are outside this three-asset delivery.
