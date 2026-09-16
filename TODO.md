# TODO

## Content

- [ ] Confirm final wording/descriptions for all six deliverables (1a–3b) with the project team
- [ ] Write a short (1–3 sentence) English description per deliverable for the overview page
- [ ] Collect source links per deliverable (start with the reference-model document for 1a–3a)
- [ ] Add owners/contacts and links for the three tools (1b–3b) once available
- [ ] Decide what "status" means per deliverable (e.g. not started / in progress / draft v0.5 /
      published) and gather current status for each

## Build (`index.html` via GitHub Pages)

- [x] Use the `using-superpowers` skill workflow (and a design/taste skill) to design and build
      `index.html`
- [x] Layout: 2 rows × 3 columns, reference model (1a–3a) on top, matching tools (1b–3b) below,
      with the 1↔1, 2↔2, 3↔3 pairing visually clear
- [x] Single self-contained static file, no build step
- [ ] Enable GitHub Pages for this repo (Settings → Pages) once `index.html` exists
- [ ] Verify the published page renders correctly

## Community feedback (issue trackers per deliverable)

- [x] Design the "Way of working" section, the Reference Model/Tools visual distinction, and
      per-card "Feedback" links in `index.html` (assumes the repos below exist)
- [ ] **Blocking**: create the six feedback repositories under the `surf-ori` org (the Claude
      Code GitHub App here only has access to `spii-overview`, not org-level repo creation —
      an org owner needs to create these, or grant the app "Administration" org permission):
      `spii-1a-values-and-principles`, `spii-1b-maturity-assessment-tool`,
      `spii-2a-landscape-researcher-journey`, `spii-2b-infrastructure-mapping`,
      `spii-3a-capabilities-interoperability`, `spii-3b-toolbox-shared-tools`
- [ ] Add a GitHub issue form (`.github/ISSUE_TEMPLATE/feedback.yml`) to each repo with fields
      for name, organisation, role, and "representing infrastructure"
- [ ] Assign a curator per deliverable and publish their name in the "Way of working" section
      (currently a generic role description, no names yet)

## Housekeeping

- [ ] Review `.claude/skills/developing-overview-html/` — describes an unrelated DuckDB-WASM
      catalog browser also called `overview.html`; decide whether to remove it from this repo
      to avoid confusing future sessions
