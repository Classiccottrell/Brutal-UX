Cobalt Systems Modernism

Design direction

A strict two-colour graphic system combining Swiss information design, brutalist scale contrast, technical editorial imagery, and optical line experiments. The work should feel engineered rather than decorated: one dominant idea, a visible grid, controlled repetition, and large areas of deliberate empty space.

This document is the source of truth for image generation and manual composition. When a prompt conflicts with these rules, these rules win unless the prompt explicitly declares an exception.

────────

1. Style invariants

Every output must preserve all seven invariants:

1. Two-colour system: cobalt blue and warm white only.
2. One dominant subject: a single object, structure, letterform, or typographic phrase controls the composition.
3. Hard geometry: rectangular modules, straight rules, stepped contours, parallel lines, or an isometric grid.
4. Swiss hierarchy: clear scale contrast between display type, labels, metadata, and empty space.
5. Flat reproduction: no naturalistic light, glossy 3D rendering, cinematic atmosphere, or photographic colour.
6. Controlled texture: texture describes form or transition; it is never an all-over distressed filter.
7. Disciplined density: choose either a sparse study or a dense technical poster. Do not average the two.

If an image breaks two or more invariants, it is outside the system even if it is blue and white.

────────

2. Locked design tokens

Colour

|Token        |Value    |Use                                                        |
|-------------|---------|-----------------------------------------------------------|
|`ink-cobalt` |`#1233C7`|All type, rules, fills, illustration, patterns, and borders|
|`paper-white`|`#F7F6F1`|Ground, knockout type, negative space                      |

• Use these as two physical inks, not as a conventional digital palette.
• Lighter blue values may appear only as cobalt broken into dots, lines, or dither against the paper—not as added grey, lavender, cyan, or gradient colours.
• Either colour may be the ground. Aim for a clear dominant ground rather than a 50/50 split.
• Do not add black, grey, beige, accent colours, shadows, or coloured highlights.

Grid and spacing

• Base unit: u.
• Outer margin: 4u minimum.
• Major grid: 6 columns for a single poster; 12 columns for a spread or pair.
• Gutters: 1u.
• Major elements align to grid edges. Small registration marks may sit on half-units.
• Preserve 25–45% negative space in Optical Line Study mode and 12–25% in Technical Poster mode.
• Use one primary alignment axis and no more than one deliberate grid break.

Line and border

• Fine rule: 0.25u.
• Standard rule: 0.5u.
• Heavy rule/frame: 1u.
• Parallel-line fields use one angle per field, normally 45° or isometric 30°/150°.
• A repeated line system must keep constant stroke width and spacing.
• No rounded corners, brush lines, hand-drawn wobble, or ornamental flourishes.

Typography

• Typeface class: neutral grotesk or condensed utilitarian sans serif.
• Preferred digital choices: Helvetica Neue, Neue Haas Grotesk, Univers, Arial Narrow, or a metrically similar sans serif.
• Display type: uppercase, bold or black, tightly set.
• Secondary labels: uppercase, medium or bold.
• Metadata: uppercase, regular or medium, compact and functional.
• Use only two weights in one composition.
• Display type may be filled, outlined, repeated, offset, stretched vertically, or stepped—but apply only one transformation system per composition.
• Outlined text uses a single cobalt stroke with a white interior; never use bevels, drop shadows, glow, or chrome effects.
• For AI-generated imagery, keep literal text to a short title plus simple numerals. Add complex copy during layout rather than asking the image model to typeset it.

────────

3. Composition modes

Select exactly one mode before generating. Both modes share the invariants and tokens above.

Mode A — Technical Poster

Use for systems, cities, architecture, machines, anatomy, networks, maps, and speculative technology.

• Format: one vertical poster by default, approximately 2:3 or 3:5.
• Subject occupies 45–70% of the canvas.
• Depict the subject as a cobalt screenprint, dithered cutout, technical diagram, or isometric construction.
• Pair the hero subject with restrained interface-like information: title, index number, 3–6 metadata labels, fine rules, a small map, barcode-like mark, or registration crosses.
• Use strong hierarchy: one oversized title or number, one hero image, and small supporting data.
• Texture may include halftone, ordered dither, fine screentone, or a single fade built from dot density.
• Keep texture localized to the subject or one transition area.
• A two-poster pair is an optional output format, not a required motif. When used, the posters must behave as siblings: one organic/mechanical subject and one architectural/system subject, with matching margins and type hierarchy.

Mode B — Optical Line Study

Use for abstract marks, letterforms, motion, rhythm, dimensional illusions, and identity experiments.

• Format: one vertical panel or a controlled two-panel study.
• Use one large motif: a letter, stepped contour, rectangular void, stripe field, or extruded word.
• Subject occupies 55–85% of the active panel.
• Choose one operation only: repeat, offset, extrude, crop, warp, outline, or dissolve.
• Typography becomes image; supporting labels are normally omitted.
• Texture is minimal. A dither fade may appear in one object, but halftone, metadata, barcodes, and isometric scenery stay out.
• Preserve broad uninterrupted cobalt or paper fields.

Mode separation rule

Do not place a dense isometric city, a warped display word, a full stripe field, and extensive metadata in the same composition. If a crossover is needed, one mode supplies 80% of the visual language and the other contributes one secondary device only.

────────

4. Texture grammar

Use no more than two texture families in Technical Poster mode and no more than one in Optical Line Study mode.

Allowed:

• Ordered pixel dither
• Coarse or fine halftone dots
• Parallel-line screentone
• One-directional line extrusion
• Subtle paper grain visible mainly in the white ground
• Hard-edged pixel breakup at a localized boundary

Avoid:

• Generic grunge overlays
• Random film noise across the whole canvas
• Multidirectional glitch effects
• RGB splitting, neon glow, lens effects, or chromatic aberration
• Soft airbrush shading without a dot or line structure
• Simultaneous dither, halftone, pixel sorting, scanlines, and distressed ink

Texture must have a job: show depth, create a fade, imply reproduction, or connect repeated forms.

────────

5. Image and spatial treatment

• Use orthographic or shallow isometric construction; avoid wide-angle perspective.
• Depth comes from overlap, scale, negative space, line density, and solid/knockout contrast.
• Forms should remain legible as silhouettes before texture is added.
• Crop boldly but do not crowd every edge.
• Keep one focal region sharp and high contrast.
• No realistic cast shadows. If separation is needed, use an offset cobalt repeat, knockout edge, or denser screen pattern.
• Human or organic subjects should be rendered as technical scans, diagrammatic cutaways, or screenprinted forms—not polished photography.

────────

6. Reference roles

The reference set is not a menu of effects. Each image teaches a specific rule:

|Reference                                  |Primary lesson                                                                                        |
|-------------------------------------------|------------------------------------------------------------------------------------------------------|
|`Système et cybernétique urbaine.png`      |Technical Poster hierarchy: large title/number, hero system image, micro-data, strict vertical grid   |
|`8BD7AB77-AC8D-4AB1-8567-02FEC72B13EA.jpeg`|A single geometric object can carry a controlled dither fade; stripe fields remain separate and simple|
|`6DB40D69-C73E-469D-B0A1-11179310CB85.jpeg`|One-line contour and one-directional typographic extrusion                                            |
|`12FE95F2-6EDF-4AB8-ADE5-60334562CB16.jpeg`|Outline repetition versus one centered tonal object; large quiet fields                               |
|`C77BCC14-EDFF-4449-A639-7D1327005D01.jpeg`|Repetition and line removal as primary operations, not decoration                                     |
|`0CF49828-05BF-4FA5-A1AA-4A2C3BE326CF.png` |Modular stepped geometry, controlled frame weight, and positive/negative reversal                     |

Reference priority when resolving ambiguity:

1. Palette and restraint from the full set
2. Composition mode rules in this document
3. Subject-specific treatment from the closest reference
4. Decorative texture last

────────

7. Master prompt blocks

A. Compact token block

```text
cobalt systems modernism, strict two-ink cobalt blue #1233C7 and warm paper white #F7F6F1, Swiss information hierarchy, brutalist scale contrast, one dominant subject, visible modular grid, hard-edged rectangular geometry, utilitarian grotesk typography, flat screenprint reproduction, structured negative space, precise alignment, controlled repetition, no additional colours
```

Append one mode block:

```text
TECHNICAL POSTER: vertical 2:3 composition, one large diagrammatic or shallow-isometric hero subject, oversized title or index number, restrained micro-labels and technical data, localized ordered dither and halftone, fine registration rules, 12–25% negative space
```

```text
OPTICAL LINE STUDY: vertical panel, one oversized letterform or geometric motif, one transformation operation only, constant-width parallel lines or stepped outline repetition, broad uninterrupted colour fields, minimal texture, 25–45% negative space
```

B. Natural-language master block

```text
Create a rigorously structured two-ink graphic composition using only cobalt blue (#1233C7) and warm paper white (#F7F6F1). Build the layout on a visible Swiss modular grid with precise alignment, hard rectangular geometry, strong scale contrast, and generous intentional negative space. Give the composition one unmistakable dominant subject and one visual operation. Use neutral utilitarian grotesk typography in uppercase, limited to two weights. Treat the artwork as a flat screenprint: create depth only through overlap, knockout shapes, ordered dither, halftone, or constant-width parallel lines. Keep texture localized and functional. Do not introduce naturalistic lighting, extra colours, soft 3D rendering, decorative clutter, or unrelated effects.
```

C. Negative block

```text
no black, no grey ink, no cyan, no purple, no additional accent colour, no photorealistic lighting, no glossy 3D, no gradients made from new colours, no drop shadows, no glow, no rounded UI cards, no soft blobs, no hand-drawn lines, no random grunge, no full-canvas noise, no RGB glitch, no multiple perspective systems, no decorative icons, no crowded collage, no more than two texture families, no illegible paragraphs, no imitation brand logos
```

────────

8. Prompt construction template

Build prompts in this order. Do not add style synonyms after the constraint block.

```text
[SUBJECT AND MESSAGE]

Mode: [Technical Poster | Optical Line Study].
Composition: [format, focal placement, scale, negative-space target].
Geometry: [isometric grid | rectangular modules | stepped contour | parallel-line field].
Typography: [short title or numeral, hierarchy, filled or outlined].
Texture: [zero, one, or two allowed texture families] localized to [specific area].

[NATURAL-LANGUAGE MASTER BLOCK]
[MODE BLOCK]
[NEGATIVE BLOCK]

Output: [aspect ratio and resolution].
```

Example — Technical Poster

```text
A speculative underground mushroom farm shown as a cutaway technical system. Mode: Technical Poster. Vertical 2:3 poster. Place one large shallow-isometric farm structure in the lower two-thirds with a large index “04” and the title “SUBSTRATE SYSTEM” above it. Add only four small data labels and two registration crosses. Use ordered dither for underground depth and fine parallel-line screentone on ventilation shafts; keep all other areas flat. Preserve roughly 18% negative space.

Create a rigorously structured two-ink graphic composition using only cobalt blue (#1233C7) and warm paper white (#F7F6F1). Build the layout on a visible Swiss modular grid with precise alignment, hard rectangular geometry, strong scale contrast, and generous intentional negative space. Give the composition one unmistakable dominant subject and one visual operation. Use neutral utilitarian grotesk typography in uppercase, limited to two weights. Treat the artwork as a flat screenprint: create depth only through overlap, knockout shapes, ordered dither, halftone, or constant-width parallel lines. Keep texture localized and functional.

No additional colours, no naturalistic lighting, no glossy 3D, no cast shadows, no rounded forms, no all-over grunge, no RGB glitch, no decorative collage, no more than two texture families, no long AI-generated text.
```

Example — Optical Line Study

```text
An abstract capital “N” treated as an optical line object. Mode: Optical Line Study. Vertical 2:3 panel with a cobalt ground. Center one oversized white outlined letter occupying 70% of the panel. Repeat its outline in a single down-right direction at constant intervals to form a stepped extrusion. No supporting copy and no secondary motif. Preserve one broad uninterrupted cobalt region.

Use only cobalt blue (#1233C7) and warm paper white (#F7F6F1), a strict modular alignment, hard edges, constant-width lines, and flat screenprint reproduction. No gradients, dither, halftone, metadata, isometric scenery, shadows, glow, extra colours, or multiple transformations.
```

────────

9. Anti-drift checklist

Review every output in this order:

Gate 1 — Immediate rejection

• Are there exactly two hues?
• Is the dominant subject obvious at thumbnail size?
• Was exactly one composition mode selected?
• Is the result flat and graphic rather than cinematic or glossy?

If any answer is no, regenerate before making smaller edits.

Gate 2 — System fit

• Does the work have a clear grid and alignment logic?
• Is there meaningful negative space?
• Is only one primary visual operation in control?
• Are type weights, line widths, and texture families within their limits?
• Does texture describe form rather than coat the image?

Gate 3 — Reference fit

• Could the result sit beside the references without needing an explanation?
• Does it borrow a principle rather than copying a specific composition?
• Has any fashionable but unrelated effect entered the image?

Target score: at least 9 of 10 checks passed, with all Gate 1 checks mandatory.

────────

10. Controlled variation

These variables may change without changing the art direction:

• Cobalt as ground versus paper as ground
• Technical Poster versus Optical Line Study
• Filled versus outlined display type
• Orthographic front view versus shallow isometric view
• One approved texture family versus two in Technical Poster mode
• Sparse top-heavy, centered, or bottom-heavy composition
• Single poster versus explicitly requested paired posters

These changes require a declared exception because they alter the identity:

• A third colour
• Rounded or organic decorative geometry
• Naturalistic photography or lighting
• Serif, script, or humanist typography
• Soft shadows, glass, chrome, or glossy depth
• More than two competing focal subjects
• Mixing both composition modes at equal strength

────────

11. What changed from the original style block

• “Monochromatic cobalt and white” became an exact two-ink palette. This removes blue/purple/grey drift.
• The poster pair became optional. It is an output format, not part of every image’s visual DNA.
• Dense and sparse references became two explicit modes. This prevents the model from combining every reference into one collage.
• Pixel sorting was removed as a default. The references mainly show ordered dither, halftone, line repetition, and localized breakup.
• Flat lighting was clarified. Tonal fades are allowed only when built from cobalt dot or line density, not soft digital lighting.
• Typography received limits. Two weights and one transformation system prevent arbitrary experimental type.
• Texture received a budget and a purpose. This blocks generic grunge and multi-effect noise.
• Composition received measurable constraints. Margins, negative-space ranges, subject scale, and hierarchy can now be checked.
• A rejection checklist was added. The system can be evaluated consistently instead of relying on a vague feeling of similarity.

────────

12. Short directive for agents

```text
Follow design.md as a constraint system, not a mood board. First select one composition mode. Preserve the exact two-ink palette, one dominant subject, Swiss grid hierarchy, flat reproduction, and the texture budget. Prefer subtraction when uncertain. Never combine all reference techniques in one output. Before delivery, run the anti-drift checklist and reject any result that fails Gate 1.
```
