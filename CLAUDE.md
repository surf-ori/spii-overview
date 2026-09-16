# CLAUDE.md

Agent context for working on the `spii-overview` repository.

## What this repo is

A static, single-page overview of the six SPII deliverables, meant to be published as
`index.html` via GitHub Pages. `index.html` is built and lives at the repo root (see
`docs/superpowers/specs/2026-09-16-index-page-design.md` and
`docs/superpowers/plans/2026-09-16-spii-index-page.md` for the design rationale and how it was
built). `test-index.mjs` is its check script — run `node test-index.mjs` after any edit. See
`README.md` for the project background and the deliverables table.

## The six deliverables — canonical structure

Two rows of three, each column a pair: the tool in row 2 operationalises the reference-model
item directly above it in row 1.

```
Reference Model:  1a Values and Principles   2a Landscape & Researcher Journey   3a Capabilities & Interoperability
Tools:            1b Maturity Assessment     2b Mapping of Infrastructures       3b Tool Box of Shared Tools
                     Tool (tool for 1a)         and Projects (tool for 2a)          (tool for 3a)
```

Keep this pairing (1a↔1b, 2a↔2b, 3a↔3b) visible in any layout — it's the whole point of the
page, not an implementation detail.

Source material: the uploaded document *"Towards a reference model for an open science
infrastructure"* (SPII, version 20-07-2026) describes the reference model's four deliverables
(shared guiding principles; reference model; mapping/landscape overviews; interoperability
framework + self-assessment tools) that this 1a–3b structure was distilled from. If deliverable
names or scope change, that source document is the one to re-check against, not this file.

## Language and audience

English throughout — the page is for an international/EU Open Science audience, not just
Dutch stakeholders.

## Status — done, pending GitHub Pages

`index.html` is complete and reviewed. What's outstanding is entirely administrative: an org
owner or repo admin needs to enable GitHub Pages (repo Settings → Pages → Source: "Deploy from
a branch" → Branch: `main` → folder `/ (root)`) once this branch is merged. See `TODO.md`.

## Conventions

- Keep the page a single self-contained static file (no build step) unless a real need for
  more emerges — this is a small overview page, not an application.
- Don't touch `.claude/skills/developing-overview-html/` — it documents an unrelated
  DuckDB-WASM/DuckLake catalog browser (also confusingly named `overview.html`) that has
  nothing to do with this project's deliverables page. Flagged in `TODO.md` for cleanup;
  ignore it otherwise.
