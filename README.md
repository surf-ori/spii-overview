# SPII Overview

A public overview of the six deliverables of **SPII** (Strategic Plan for Integrated Open
Science Infrastructure). This repository will hold a static, single-page overview
(`index.html`, published via GitHub Pages) that presents the six deliverables and their status.

## About SPII

SPII develops a plan for a coherent and connected Open Science infrastructure (OSI)
landscape/ecosystem that supports researchers and institutions in practicing Open Science.

The current Dutch OSI landscape is fragmented: many universities, universities of applied
sciences and national service providers are independently building parts of an Open Science
infrastructure, alongside international efforts (Open Research Europe, OpenAIRE, EOSC/EOSC-NL).
SPII's response is a **reference model**: a broadly-supported, technology-agnostic framework
that describes the entities, functions and relationships an OSI needs, so infrastructure owners
and developers can align their components with it while keeping room for their own
implementation choices.

> An Open Science infrastructure comprises the tools, software, workflows, platforms and
> digital services needed to practice Open Science — facilitating the management and sharing
> of FAIR research data, software, publications and other research outputs.
> — *OSNL call for Open Science infrastructures, 2024*

Source: *Towards a reference model for an open science infrastructure* (SPII, version
20-07-2026).

## The six deliverables

The reference model (top row) and its accompanying tools (bottom row) are paired: each tool
operationalises the reference-model component directly above it.

| | Reference Model | Tools |
|---|---|---|
| **1** | **1a. Values and Principles** — shared values and operationalised principles underlying the Open Science infrastructure ecosystem | **1b. Principles Alignment Tool** — self-assessment tool for infrastructure owners/developers to check how far their component follows the principles |
| **2** | **2a. Landscape & Researcher Journey** — overview of the OSI landscape/ecosystem and how it supports the researcher's journey | **2b. Mapping of Infrastructures and Projects** — mapping of existing infrastructural components and projects along several dimensions (domain, functional role, level, owner), to identify duplications and gaps |
| **3** | **3a. Capabilities & Interoperability** — the functions, relationships and (cross-/intra-domain syntactic) interoperability the reference model describes | **3b. Tool Box of Shared Tools** — a shared set of reusable tools supporting those capabilities and interoperability |

## Feedback and way of working

Each deliverable has its own repository and issue tracker, so feedback is collected in the open
and its outcome stays traceable. See the "Way of working" section on the published page, or the
trackers directly:

- [spii-1a-values-and-principles](https://github.com/surf-ori/spii-1a-values-and-principles/issues)
- [spii-1b-maturity-assessment-tool](https://github.com/surf-ori/spii-1b-maturity-assessment-tool/issues)
- [spii-2a-landscape-researcher-journey](https://github.com/surf-ori/spii-2a-landscape-researcher-journey/issues)
- [spii-2b-infrastructure-mapping](https://github.com/surf-ori/spii-2b-infrastructure-mapping/issues)
- [spii-3a-capabilities-interoperability](https://github.com/surf-ori/spii-3a-capabilities-interoperability/issues)
- [spii-3b-toolbox-shared-tools](https://github.com/surf-ori/spii-3b-toolbox-shared-tools/issues)

A curator per deliverable triages incoming issues and records whether they were accepted,
rejected, or already covered, with a short rationale, before closing them. Curators are not yet
assigned per deliverable — see `TODO.md`.

## Repository contents

- `README.md` — this file
- `CLAUDE.md` — project/agent context for working on this repo with Claude Code
- `TODO.md` — task list
- `index.html` — the published overview page (GitHub Pages)
- `test-index.mjs` — check script for `index.html` (run via `node test-index.mjs`)
- `docs/superpowers/` — design spec and implementation plan for `index.html`

## License

EUPL — see [LICENSE](LICENSE).

Fonts (Outfit, Source Serif 4, IBM Plex Mono) are licensed under the SIL Open Font License.
