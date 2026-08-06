# Cobalt Systems Modernism — Art Direction Prompt Set
### 10 reference prompts for shaping visual direction

These are ready-to-paste, Midjourney-syntax (Style Block A) prompts built against [`design.md`](./design.md). Each is tagged with its mode, an art-direction intent line, and the negative-space/texture target it should land in. Swap to Style Block B prose (see `design.md` §8) for Flux/DALL-E 3.

All prompts assume `--v 6.1 --style raw --stylize 150` on Midjourney unless noted.

---

## Mode A — Technical Poster (5)

### 1. Transit Index
**Intent:** Establish the "system diagram as poster" baseline — grid, index numbers, metadata labels doing the compositional work.
```
A schematic transit network diagram of a fictional coastal city, single dominant route structure with numbered station nodes and coordinate metadata labels, isometric perspective, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, localized dither noise texture, parallel line screentones, geometric modular forms, utilitarian sans-serif typography, outlined index numbers, flat lighting, grid-based, minimalist --ar 9:16 --style raw
```

### 2. Turbine Cutaway
**Intent:** Mechanical cutaway subject — tests isometric construction and localized shading discipline on a single dense object.
```
An isometric cutaway diagram of a wind turbine mechanism, internal gears and rotor shaft exposed with index numbers and short metadata callouts, centered on a strict grid, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, localized dither noise shading on internal forms only, parallel line screentones, utilitarian sans-serif typography, flat lighting, minimalist --ar 9:16 --style raw
```

### 3. Data Center Rack
**Intent:** Infrastructure-as-subject, dense modular repetition without tipping into Mode B's single-operation rule.
```
An isometric cross-section of a modular server rack data center, repeating rectangular unit nodes with small metadata labels and status index numbers, strong grid alignment, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, localized halftone dot shading, parallel line screentones, utilitarian sans-serif typography, flat lighting, minimalist --ar 1:1 --style raw
```

### 4. Orbital Station Cutaway
**Intent:** Speculative-tech register — tests the system on a subject with no real-world reference to lean on.
```
An isometric cutaway of a speculative orbital research station, modular ring segments and docking arms with index numbers and coordinate metadata, single dominant structure on a visible grid, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, localized dither noise texture on shaded panels, parallel line screentones, utilitarian sans-serif typography, flat lighting, minimalist, vertical poster layout --ar 9:16 --style raw
```

### 5. Harbor Index Map
**Intent:** Map/cartographic register — coordinate grid and metadata density at the upper edge of Mode A's negative-space range (near 25%).
```
A topographic index map of a harbor coastline, coordinate grid overlay, numbered depth markers and short metadata labels along the shoreline, single dominant landmass and channel system, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, localized parallel line screentones representing depth, minimal dither noise, utilitarian sans-serif typography, flat lighting, grid-based, minimalist --ar 9:16 --style raw
```

---

## Mode B — Optical Line Study (5)

### 6. Warped Numeral
**Intent:** Single transformation operation = warp. Tests large uninterrupted fields and near-zero texture.
```
A single oversized numeral rendered in warped perspective, smooth continuous distortion across its form, centered in a large uninterrupted field, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, no texture, utilitarian sans-serif typography, flat lighting, minimalist, generous negative space --ar 1:1 --style raw
```

### 7. Concentric Arc Field
**Intent:** Single transformation operation = repetition. Establishes the "motion without gradient" language.
```
A field of concentric arcing lines radiating from a single off-center point, evenly repeated line weight, no other elements, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, no texture, flat lighting, minimalist, large uninterrupted negative space --ar 9:16 --style raw
```

### 8. Extruded Letterform Block
**Intent:** Single transformation operation = extrusion. Dimensional letterform without isometric-system vocabulary bleeding in from Mode A.
```
A single condensed sans-serif letterform extruded into a flat dimensional block, orthographic frontal view, no shading, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, no texture, flat lighting, minimalist, large uninterrupted negative space --ar 1:1 --style raw
```

### 9. Moiré Interference Study
**Intent:** Repetition operation pushed toward optical/motion effect — the one case where fine line density is the whole subject, not a texture pass.
```
Two overlapping sets of fine parallel lines at a slight angle offset creating a moiré interference pattern, single continuous field, no other elements, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, flat lighting, minimalist, generous negative space --ar 9:16 --style raw
```

### 10. Dimensional Dot-Grid
**Intent:** Repetition operation applied to a dot module rather than a line — tests halftone-derived pattern used as the primary subject, not as shading.
```
A dimensional grid of dots increasing in scale toward one corner, single continuous field with no other elements, brutalist graphic design, swiss style, monochromatic cobalt blue and white, high contrast, flat lighting, minimalist, large uninterrupted negative space --ar 1:1 --style raw
```

---

## Notes for use

- Prompts 1–5 target Mode A's 12–25% negative-space range; prompts 6–10 target Mode B's 25–45% range. If a result looks cramped or busy for its mode, subtract an element before regenerating — do not just widen the margins.
- None of these introduce a third color or naturalistic lighting. Run any output through the anti-drift checklist (`design.md` §9) before treating it as on-system.
- For Flux/DALL-E 3, translate using Style Block B prose (`design.md` §8) and keep the same subject/mode/intent — only the phrasing register changes, not the constraints.
