# SPII overview page — design spec

Status: approved by user (hero direction), ready for implementation planning.

## Purpose

A single static `index.html`, published via GitHub Pages, presenting the six SPII
deliverables to an international/EU Open Science audience. See `README.md` for project
background and `CLAUDE.md` for the canonical 1a-3b deliverable structure this page must
communicate.

## Design read

Modern editorial overview/landing page for policy and infrastructure stakeholders (not a
dashboard, not a product marketing page). Calm but designed, content-first. Confirmed with
the user via three clarifying questions:

- Vibe: **modern editorial** (over "serious institutional" or "premium tech-forward")
- Palette: **Forest** — deep green accent on a bone/neutral base (over cobalt/blue or
  monochrome+pop)
- Theme: **light + dark**, following `prefers-color-scheme`

Dial inference (from the `design-taste-frontend` / tasteskill methodology, see Research notes):
editorial preset — `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 4`, `VISUAL_DENSITY: 3`. Calm,
content-forward, restrained motion (CSS transitions/reveals only, no scroll-hijacking - this
is a six-card overview page, not a scroll narrative).

## Hero: Option B (approved)

Asymmetric split hero: headline + subtext + CTAs on the left, an abstract SVG diagram on the
right — three connected hexagons (reference model, 1a-3a) linked down to three more (tools,
1b-3b). This is a simple geometric mark, not a stock photo or fake product screenshot, and it
previews the page's central idea (reference model paired with tools) before the reader
scrolls.

Hero copy (final, zero em-dashes per taste-skill's typography rules):
- Headline (wraps to 3 balanced lines at desktop with the wider hero column and reduced type
  scale added for this wording): "A coherent and connected Open Science infrastructure for
  the Netherlands."
- Subtext (≤ 20 words): "Six deliverables, one reference model. A shared framework, and
  the tools that put it into practice."
- CTAs: primary "View the deliverables" (→ `#deliverables`), secondary "Read the
  background" (→ `#about`)

## Page structure

1. **Nav** — wordmark "SPII", single line, ≤ 80px height, anchor links to Deliverables
   and About. No hamburger needed at this scale.
2. **Hero** (Option B, above)
3. **Deliverables grid** (`#deliverables`) — the page's core content:
   - Section heading "The six deliverables" + one sentence explaining the top/bottom pairing.
     No separate eyebrow label here (the heading alone carries it).
   - Row 1 (Reference Model): 1a Values and Principles, 2a Landscape & Researcher Journey,
     3a Capabilities & Interoperability
   - A connector between each column (dashed vertical line, or small down-arrow) making the
     1a↔1b / 2a↔2b / 3a↔3b pairing visually explicit, not just labeled
   - Row 2 (Tools): 1b Principles Alignment Tool, 2b Mapping of Infrastructures and Projects,
     3b Tool Box of Shared Tools
   - Each card: mono code (1A/1B/...), short title, one-sentence description (≤ 25 words,
     content drawn from the reference-model source document, no filler verbs)
   - Mobile (< 768px): grid collapses to a single column; row 1 and row 2 stay in their
     original top-to-bottom order per pair so the 1a↔1b relationship still reads
     top-to-bottom instead of interleaving oddly
4. **About** (`#about`) — condensed SPII background paragraph (from `README.md`/source docx):
   what SPII is, why a reference model, source citation (document title + version date)
5. **Footer** — project name, EUPL license mention, no fake version stamps or social links
   that don't exist

No other sections. This is a short overview page, not a full marketing site: four sections is
enough, and adding more (testimonials, logo walls, etc.) is out of scope and would be
inventing content SPII doesn't have.

## Design tokens

**Color** (single accent, forest green; no beige/brass default, no AI-purple):

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#f6f4ec` | `#10140f` |
| `--surface` | `#ffffff` | `#161c15` |
| `--surface-2` | `#eeebdf` | `#1c231b` |
| `--text` | `#161f18` | `#eae7db` |
| `--text-muted` | `#4d5850` | `#9fad9f` |
| `--accent` | `#1f5c43` | `#59b98a` |
| `--accent-strong` | `#153f2e` | `#7fd1a6` |
| `--accent-soft` | `#dfe9df` | `#1e2c22` |
| `--border` | `#d9d4c3` | `#2b342a` |
| `--on-accent` | `#fbfdfb` | `#10140f` |

`--on-accent` is the text color used on top of `--accent` (primary button label). It is near-white in light mode and near-black in dark mode because `--accent` lightens considerably in dark mode to stay visible on the dark background, which would leave white button text under the WCAG AA floor.

Follows `prefers-color-scheme`; no manual toggle (small static page, system preference is
enough). No pure black/white anywhere.

**Type:**
- Display (headlines, nav, buttons): **Outfit** (sans, geometric, not Inter/Space Grotesk —
  avoids the two most common AI-generated-page defaults)
- Body (subtext, card descriptions, About paragraph): **Source Serif 4** — deliberate
  inversion of the usual "serif display + sans body" pattern, gives the reading copy an
  editorial character without the generic warm-cream-and-serif-headline look
- Labels/codes (`1A`, `1B`, ...): **IBM Plex Mono**, small, letter-spaced

All three load from Google Fonts (the only external stylesheet host the project's Artifact
mockup used; for the real GitHub Pages file we'll self-host or use the same Google Fonts
`<link>` — decide in the implementation plan based on whether offline/self-contained matters
more than a network request).

**Layout:** `max-width: 1100px` centered wrapper, `20px` side gutter minimum. CSS Grid for the
deliverables grid (`1fr 1fr 1fr`, collapsing to one column under 768px). No JS framework, no
build step — single self-contained HTML file per `CLAUDE.md` conventions (inline `<style>`,
vanilla JS only if needed for nothing more than the mobile nav, which likely isn't even
necessary at this content size).

## Content mapping (source: docx "Towards a reference model for an open science
infrastructure", v20-07-2026 — see `README.md`)

| Code | Title | Card copy |
|---|---|---|
| 1A | Values and Principles | Shared values and principles that define a connected Open Science infrastructure. |
| 2A | Landscape & Researcher Journey | A map of the ecosystem, seen through the path a researcher actually takes. |
| 3A | Capabilities & Interoperability | The functions every component needs, and how they connect across domains. |
| 1B | Principles Alignment Tool | Check how far an infrastructure component follows the shared principles. |
| 2B | Mapping of Infrastructures & Projects | Existing components and projects, mapped to find overlaps and gaps. |
| 3B | Tool Box of Shared Tools | A shared set of reusable tools that put interoperability into practice. |

## Accessibility & robustness

- WCAG AA contrast in both themes (checked against the token table above)
- `prefers-reduced-motion` respected for any transition/reveal
- Single-column mobile layout, no horizontal scroll
- No em-dashes anywhere in shipped copy (typographic rule from the design-taste research, also
  just good practice)

## Out of scope

- CMS/dynamic content, build tooling, JS framework
- Multi-page site (this is one page)
- Manual dark/light toggle (system preference only)
- Any content not traceable to the source reference-model document or the user's explicit
  6-deliverable structure (no invented testimonials, logos, or stats)

## Research notes

- **Prior art in this repo:** none — `spii-overview` had no existing `index.html` or design
  system before this spec (confirmed via repo listing at session start).
- **External design guidance:** reviewed the `design-taste-frontend` / "tasteskill" skill from
  <https://github.com/Leonxlnx/taste-skill> (MIT-licensed) at the user's request. It's a
  React/Tailwind-oriented anti-generic-AI-design ruleset; most of its concrete rules (brief
  inference → dials, color/typography discipline, hero content limits, "AI tell" bans like
  em-dashes and generic 3-card rows, WCAG contrast checks) are framework-agnostic and were
  applied directly to this vanilla-HTML design. Its React/Tailwind/GSAP-specific code
  skeletons don't apply since this project ships a single static file with no build step.
- Not vendored into `.claude/skills/` in this repo (would need a project decision on
  maintaining a trimmed, framework-agnostic version); noted here so the reasoning is
  traceable if this comes up again.

## Approval

Design read, palette, theme strategy and hero direction (Option B) confirmed by the user in
this session (2026-09-16), via structured questions and a two-option Artifact mockup
(<https://claude.ai/artifact/KQzjac3jKqjSMw8ELFfmxi>).
