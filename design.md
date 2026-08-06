# Cobalt Systems Modernism
### Design Constraint System — v1.0

This document is the single source of truth for the **Cobalt Systems Modernism** visual language. It is written to be machine-followed: an image-generation agent (e.g. the "Cobalt Modernism Designer" Gem) reads this file as its constraint system, and any prompt or request that conflicts with it loses unless it explicitly declares an exception.

Numbered sections are referenced by name elsewhere (agent instructions, prompt templates) — do not renumber without updating those references.

---

## 1. Style Invariants

These are non-negotiable. Every output, in either mode, must satisfy all of them.

- **Two inks only.** `ink-cobalt` `#1233C7` and `paper-white` `#F7F6F1`. No third hue, no tints treated as a separate color (halftone/dither may *simulate* intermediate values optically, but the source palette stays two flat inks).
- **One dominant subject per composition.** No competing focal points, no split-attention collages.
- **Flat reproduction only.** No naturalistic/soft lighting, no gradients used for realism, no glossy 3D render quality, no photographic color grading. Depth is built through line weight, scale, layering, and contrast — never shading.
- **Screenprint / risograph fidelity.** Edges are precise, registration is intentional, texture reads as printed, not rendered.
- **Grid-legible.** The underlying structure (Section 6) should be inferable even when not drawn explicitly.

**Exception clause:** the photographic complement (Section 8, Asset C) is the only sanctioned deviation from "flat reproduction," and only when a prompt explicitly invokes it.

---

## 2. Mode Selection

Every generation implements **exactly one** of the following two modes. There is no hybrid mode.

### Mode A — Technical Poster
System cutaways, maps, networks, speculative tech, infrastructure. Built to look like it belongs in a technical manual or transit authority's signage system.
- Strong hierarchy: display title → section label → metadata/index numbers.
- Visible or strongly implied grid.
- Index numbers, coordinate/metadata labels, callout marks.
- Negative space target: **12–25%** of canvas.
- Texture: localized dither/halftone, used to shade specific forms — never a full-bleed treatment.

### Mode B — Optical Line Study
Abstract motifs, letterforms, motion, dimensional pattern. Built to look like a type foundry's optical specimen or a kinetic print experiment.
- Exactly **one primary transformation operation** applied to the subject: repetition, extrusion, or warp. Pick one — do not stack operations.
- Large, uninterrupted fields of flat ink or paper.
- Minimal texture — decoration is structural (line, repetition, spacing), not surface noise.
- Negative space target: **25–45%** of canvas.

---

## 3. Mode Separation Rule

Mode A and Mode B are never blended in equal strength. A composition is either a Technical Poster or an Optical Line Study — never both at once.

- Do not place index numbers/metadata labels (Mode A vocabulary) inside a Mode B composition.
- Do not apply multiple transformation operations (Mode B vocabulary) inside a Mode A composition.
- Do not average two reference techniques together "for richness." Pick the one that serves the subject and commit.
- If a prompt requests elements of both, resolve the conflict by asking which mode dominates, or default to the mode implied by the primary subject (systems/data → A, letterform/motif/motion → B).

---

## 4. Texture System

Texture is a controlled resource, not a background treatment.

**Allowed textures:** dither/noise gradient, pixel-sort grain, parallel line screentone, halftone dot.

**Budget:**
- Mode A: texture may be applied locally to shade specific forms (a shadow plane, a density map, a data field). Cap total textured area at roughly **15%** of canvas. Never texture typography or the primary contour line of the dominant subject.
- Mode B: texture is near-absent. If used at all, it is a single fine screentone or dither pass confined to a small transitional zone (≤ **5%** of canvas) — the field should otherwise read as flat, uninterrupted ink.

**Prohibited:** texture used to fake lighting/depth (drop shadows, ambient occlusion, bloom), texture covering the full canvas uniformly, texture that obscures the grid or hierarchy, more than one texture family stacked in the same zone.

---

## 5. Typography & Hierarchy

- **Typeface character:** neutral grotesk or condensed sans-serif only. No serif, no script, no decorative display faces.
- **Weight limit:** two weights maximum per composition (e.g., one bold display weight + one regular/label weight).
- **Hierarchy tiers**, high to low:
  1. **Display** — title/subject name. Largest, boldest, sets the composition's anchor.
  2. **Label** — section names, callouts, short descriptors.
  3. **Metadata** — index numbers, coordinates, codes, timestamps. Smallest, often monospaced-feeling numerals, always aligned to the grid.
- Text may be filled or outlined, never both treatments competing on the same word.
- For generated images: keep literal text to short titles and simple numerals. Do not attempt long-form paragraph text — it will not render reliably and breaks the poster-not-document quality of the system.

---

## 6. Grid, Base Units & Density

**Base unit:** `u = 8px` (at any output resolution, treat `u` as 1/100 of the shorter canvas dimension if working at non-standard scale, so proportions hold).

- **Margin:** 4u minimum on all sides for Mode A; 6u minimum for Mode B (more air, per the higher negative-space target).
- **Grid:** 12-column modular grid for Mode A (system diagrams, maps, index rails). Mode B may use a reduced 4–6 column grid or a single-axis grid — just enough to keep alignment honest, not enough to visually assert itself.
- **Gutter:** 2u.
- **Alignment:** all type, index marks, and major form edges snap to the grid. Nothing floats at an arbitrary angle except where isometric/axonometric construction requires it (Mode A) or the single transformation operation requires it (Mode B).
- **Disciplined density:** negative space is a designed element, not leftover space. Mode A: 12–25% negative space. Mode B: 25–45% negative space. If a composition is denser than its mode's ceiling, subtract elements — do not shrink margins to compensate.

---

## 7. Composition & Perspective

- Mode A favors isometric/axonometric construction for dimensional subjects (cutaways, machines, cityscapes, networks) — consistent axis, no vanishing-point photographic perspective.
- Mode B favors flat, frontal, orthographic presentation — the subject is examined, not staged in space.
- Vertical formats (9:16) are the default pairing format for poster-pair layouts; 1:1 is preferred for diagrammatic/UI-bound assets. See Section 8 for the full parameter map.
- Layouts may be presented as a single composition or a paired-poster diptych (two related vertical panels), but a diptych still obeys the single-dominant-subject rule per panel.

---

## 8. Prompt Architecture

### Master formula
`{subject} in {setting}, {composition_tokens}, rendered in {style_block}, {lighting_tokens} --ar {aspect_ratio}`

| Variable | Definition |
|---|---|
| `{subject}` | Main focal entity or abstract concept — exactly one. |
| `{setting}` | Background context or systemic environment. |
| `{composition_tokens}` | Framing, isometric/orthographic angle, grid placement, single-vs-paired layout. |
| `{style_block}` | Style Block A (tokens) for Midjourney/SD, or Style Block B (prose) for Flux/DALL-E 3. |
| `{lighting_tokens}` | Flat-shading and high-contrast specification — never naturalistic. |
| `{aspect_ratio}` | Typically `9:16` (poster/pair) or `1:1` (diagram/UI asset). |

### Style Block A — Token string (Midjourney / SD)
```
brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, dither noise texture, pixel sorting grain, parallel line screentones, halftone dot patterns, geometric, modular forms, isometric perspective, utilitarian sans-serif typography, outlined text, flat lighting, grid-based, minimalist --style raw
```

### Style Block B — Prose (Flux / DALL-E 3)
> A highly structured brutalist Swiss graphic design aesthetic utilizing a strict monochromatic palette of cobalt blue (`#1233C7`) and warm paper white (`#F7F6F1`). The composition relies on precise geometric parallel line screentones and controlled dither texture, applied locally, never as a full-bleed treatment. Typography is a neutral grotesk or condensed sans-serif, limited to two weights, arranged in a clear display/label/metadata hierarchy. Lighting is completely flat and graphic — no gradients used for realism, no glossy render quality, no photographic color. The layout is grid-based, disciplined, and functional, with meaningful negative space.

### Model syntax cheat sheet

| Engine | Strategy | Parameters |
|---|---|---|
| Midjourney v6 | Style Block A (tokens). Lean on hard boundary + texture keywords. | `--v 6.1 --style raw --ar 9:16 --stylize 150` (low stylize preserves graphic rigidity) |
| Flux.1 (Dev) | Style Block B (prose). Spell out spatial relationships explicitly. | High spatial detail, natural language; instruct literal in-image text explicitly. |
| DALL-E 3 | Style Block B (prose). Call the medium "graphic design" or "risograph print," not "photorealistic." | Explicitly request "flat vector-like lighting" and "dither grain." |

---

## 9. Anti-Drift Checklist (run before every delivery)

**Gate 1 — mandatory, reject on any failure:**
1. Exactly two hues present: `#1233C7` and `#F7F6F1`. No third color, no realistic color grading.
2. One dominant subject. No competing focal points.
3. Flat graphic reproduction. No naturalistic lighting, soft shadow, glossy 3D, or photo-real surface (unless the sanctioned photographic exception was explicitly invoked).
4. Correct mode implemented, and only one mode — no blending Mode A vocabulary into Mode B or vice versa (Section 3).

**Secondary checks:**
5. Negative space within the selected mode's target range (Section 6).
6. Texture within budget and correctly localized, not full-bleed (Section 4).
7. Typography uses ≤2 weights, correct hierarchy tier order, short text only (Section 5).
8. Grid alignment holds; nothing floats off-grid without isometric/transformation justification (Section 6–7).

**When uncertain:** prefer subtraction. Remove an element, a texture pass, or a color nuance before adding a justification for keeping it. A composition that fails Gate 1 does not ship, regardless of how well it satisfies the secondary checks.

### Short directive (for rapid constraint alignment)
> Follow design.md as a constraint system. Select one composition mode. Preserve the exact two-ink palette, one dominant subject, Swiss grid hierarchy, flat reproduction, and the texture budget. Prefer subtraction. Run the anti-drift checklist and reject any result failing Gate 1.
