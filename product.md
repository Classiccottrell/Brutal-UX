# Cobalt Modernism Designer
### Product Definition — v1.0

## 1. What it is

**Cobalt Modernism Designer** is an authoritative design-system agent (a "Gem") that generates imagery strictly within the **Cobalt Systems Modernism** visual language defined in [`design.md`](./design.md). It is not a general-purpose image generator with a style suggestion attached — it is a constraint enforcer first, an image prompt-writer second. Its job is to make every output indistinguishable in discipline from a hand-built entry in the same design system, regardless of who wrote the input prompt or how loosely they described what they wanted.

## 2. Problem it solves

Freeform prompting into Midjourney/Flux/DALL-E drifts: colors creep in, lighting turns photographic, textures blanket the whole canvas, hierarchy collapses, and two visually distinct compositional families (system diagrams vs. abstract line studies) blur into a mushy in-between. Maintaining a consistent design system across many one-off prompts, multiple people, and multiple model engines requires something stricter than a style reference image — it requires a rules engine sitting in front of the prompt.

## 3. Who it's for

- Designers producing a poster/asset series that must stay visually unified across dozens of generations and multiple contributors.
- Teams prompting across more than one model engine (Midjourney, Flux, DALL-E 3) who need the same design intent translated correctly per engine's syntax.
- Anyone who has a rough idea ("I want something about a transit network" / "I want an abstract letterform study") but not a fully art-directed prompt, and needs the system to fill the gap without breaking the visual language.

## 4. Core value proposition

Input a subject, get back an image that is *provably* on-system — not just stylistically close. The agent's job is to translate loose intent into a fully specified, engine-appropriate prompt, generate against it, and verify the result against an explicit checklist before calling it done.

## 5. How it works

1. **Read the constraint system.** The agent treats [`design.md`](./design.md) as binding. A user prompt that conflicts with it loses, unless the user explicitly declares an exception.
2. **Select exactly one mode.** Every request resolves to Mode A (Technical Poster) or Mode B (Optical Line Study) — see `design.md` §2. If the subject implies both, the agent picks the mode the primary subject serves best rather than blending.
3. **Compose against the formula.** The agent fills the parameterized prompt architecture (`design.md` §8: subject / setting / composition tokens / style block / lighting tokens / aspect ratio) and selects Style Block A or B based on the target engine.
4. **Enforce hierarchy and spacing.** Typography, grid, base units, and negative-space targets are applied per mode (`design.md` §5–6), not left to the model's default instincts.
5. **Run the anti-drift checklist.** Before delivering, the agent checks the output against Gate 1 (two hues, one subject, flat reproduction, correct mode) and the secondary checks (`design.md` §9). A Gate 1 failure means the output does not ship — the agent prefers subtraction (remove an element) over rationalizing a pass.
6. **Fall back to the short directive when needed.** For rapid re-alignment mid-conversation, the agent can restate the compressed constraint summary instead of re-deriving from the full document.

## 6. Feature set

| Feature | Behavior |
|---|---|
| Strict constraint enforcement | Two-ink palette (`#1233C7` / `#F7F6F1`) and flat reproduction are enforced on every output, no opt-out. |
| Mode selection | Exactly one of Mode A / Mode B per generation; mode-mixing is explicitly rejected (`design.md` §3). |
| Hierarchy & spacing enforcement | Typography weight limits, display/label/metadata tiers, grid/base-unit alignment, and per-mode negative-space targets applied automatically. |
| Texture budgeting | Dither/halftone/screentone usage capped and localized per mode (`design.md` §4) — never a full-canvas treatment. |
| Anti-drift verification | Automated Gate 1 + secondary checklist run before delivery; failures trigger subtraction, not exception-making. |
| Multi-engine prompt translation | Same design intent expressed correctly for Midjourney (token block), Flux/DALL-E 3 (prose block), with engine-specific parameter recommendations. |
| Asset recipe library | Reusable prompt templates for common asset types (simple focal illustration, hero/complex composition, diagrammatic asset, and a sanctioned photographic complement) — see §8 below. |

## 7. Non-goals / explicit exclusions

- **Not a general-purpose stylist.** It will not produce full-color, photorealistic, or softly-lit imagery outside the one sanctioned exception.
- **Not a hybrid-mode generator.** It will not average Mode A and Mode B "for variety" — a request for both is resolved to one mode, not blended.
- **Not a long-copy layout tool.** The system is built for short titles and numerals; it is not meant to typeset paragraphs or dense body text.
- **Not a lighting/render-quality showcase.** Glossy 3D, ambient occlusion, bloom, and naturalistic shading are treated as defects, not desirable rendering fidelity.

## 8. Asset recipe library

Reusable starting points, each mapped to a use case. Full production prompts and the model syntax cheat sheet live in `design.md` §8; these are the shapes those prompts take.

| Recipe | Use case | Mode |
|---|---|---|
| **Simple focal illustration** | A single iconic subject, centered on grid, minimal setting — e.g. an isolated mechanical/anatomical object. | A |
| **Hero / complex illustration** | A multi-layered system or environment (cityscape, network), optionally a paired vertical-poster diptych. | A |
| **Diagrammatic / infographic asset** | Flow charts, node networks, UI-bound diagrams — optimized for legibility at small sizes, `--ar 1:1`. | A |
| **Optical line study** | Abstract letterform, motif, or pattern built from exactly one transformation operation. | B |
| **Complementary photography** *(sanctioned exception)* | Real-world photography color-graded and composed to evoke the system's mood (cobalt/white, high contrast) without graphic artifacts. Must be explicitly invoked — flat-reproduction rule is otherwise mandatory. | Exception |

## 9. Success criteria

- Every delivered image passes Gate 1 on first review, or is subtracted-and-regenerated until it does — no shipped exceptions without an explicit user override.
- A subject described in one sentence produces a fully art-directed, engine-correct prompt without the user having to specify palette, mode mechanics, or texture limits themselves.
- A series of outputs generated over time (different sessions, different people) reads as one coherent system, not a loose family resemblance.

## 10. Open questions / future considerations

- Whether base grid units (`design.md` §6) should be recalibrated once real output resolutions and print targets are known — the current 8px base unit is a working default, not a measured constant.
- Whether a third asset recipe category (motion/animation frame sequences) is worth formalizing if the system extends beyond static imagery.
- Whether engine-specific negative prompts (explicit "no gradient / no photoreal / no third color" exclusion lists) should be standardized alongside the positive Style Blocks in `design.md` §8.
