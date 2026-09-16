# SPII Overview index.html Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single self-contained `index.html` overview page for the SPII project's
six deliverables, ready to publish via GitHub Pages.

**Architecture:** One static HTML file with an inline `<style>` block (no framework, no build
step; the one external resource is the Google Fonts stylesheet `<link>` for Outfit/Source
Serif 4/IBM Plex Mono, which the spec's Typography section left as an open implementation
choice and Task 1 resolved in favor of). Content is built incrementally: page shell and design
tokens first, then nav+hero, then the deliverables grid, then about+footer, then a final
accessibility/copy pass. Each content addition is paired with assertions in a plain
`node:assert`-based check script (`test-index.mjs`, matching the existing repo convention from
`.claude/skills/developing-overview-html/SKILL.md`'s `test-overview-fmt.mjs`), written before
the corresponding HTML so each task has a real red/green cycle.

**Tech Stack:** Vanilla HTML/CSS, Google Fonts (Outfit, Source Serif 4, IBM Plex Mono), inline
SVG. Node.js (`node:assert/strict`, `node:fs`) for the check script, no npm dependencies.

**Spec:** `docs/superpowers/specs/2026-09-16-index-page-design.md`

## Global Constraints

- Single self-contained `index.html` at the repo root — no build step, no JS framework, no
  external CSS/JS files (per `CLAUDE.md` conventions), **except** the Google Fonts stylesheet
  `<link>` (Outfit/Source Serif 4/IBM Plex Mono) — confirmed with the user after Task 1's
  review flagged the conflict between this line and the spec's Typography section.
- English copy throughout.
- Zero em-dashes (`—`) anywhere in shipped copy.
- WCAG AA contrast (>= 4.5:1) for every text/background pairing, in both light and dark theme.
- Theme follows `prefers-color-scheme` only — no manual light/dark toggle.
- Respect `prefers-reduced-motion` for any transition.
- Deliverables grid collapses to a single column under 768px viewport width.
- Hero is sized to its content, never forced to `100vh`/`100dvh`.
- Content is limited to what's in the design spec and its source document — no invented
  testimonials, logos, or statistics.

---

## File Structure

- `index.html` (create, repo root) — the entire page: shell, design tokens, nav, hero,
  deliverables grid, about, footer. Built incrementally across Tasks 1-5.
- `test-index.mjs` (create, repo root) — plain `node:assert/strict` check script, run via
  `node test-index.mjs`. Grows across Tasks 1-5: each task appends a new block of assertions
  and a `console.log` line, never rewriting earlier blocks.
- `README.md` (modify) — Task 6, drop the "(planned)" qualifier on `index.html` once it exists.
- `TODO.md` (modify) — Task 6, check off completed items under "Build".
- `docs/superpowers/specs/2026-09-16-index-page-design.md` (modify) — Task 1, add the
  `--on-accent` token discovered while verifying contrast (see Task 1 note); the spec's token
  table didn't include a dedicated "text on the accent-colored button" token, and one is
  needed to keep the dark-mode primary button at WCAG AA.

---

### Task 1: Page shell, design tokens, and the check script

**Files:**
- Create: `test-index.mjs`
- Create: `index.html`
- Modify: `docs/superpowers/specs/2026-09-16-index-page-design.md` (add `--on-accent` token)

**Interfaces:**
- Produces: CSS custom properties on `:root` (light) and inside
  `@media (prefers-color-scheme: dark)` (dark) — `--bg`, `--surface`, `--surface-2`, `--text`,
  `--text-muted`, `--accent`, `--accent-strong`, `--accent-soft`, `--on-accent`, `--border`.
  Produces the `.wrap` container class (`max-width:1100px; margin:0 auto; padding-inline:20px`)
  every later section reuses. Produces `contrastRatio(hexA, hexB)` and `relativeLuminance(hex)`
  helpers in `test-index.mjs` that later tasks' assertions can also call.

- [ ] **Step 1: Add the missing contrast token to the spec**

  The spec's dark palette pairs `--accent:#59b98a` with white button text, but
  `contrastRatio('#59b98a', '#ffffff')` is ~2.4:1 — well under the 4.5:1 AA floor. Dark near-
  black text on that same green (`contrastRatio('#59b98a', '#10140f')` is ~7.7:1) passes
  comfortably, and the light-theme accent already has enough contrast with near-white text
  (~7.7:1). Add a token for this to the spec's color table:

  In `docs/superpowers/specs/2026-09-16-index-page-design.md`, in the "Color" table, add a row:

  ```markdown
  | `--on-accent` | `#fbfdfb` | `#10140f` |
  ```

  right after the `--border` row, and add one sentence directly below the table:

  > `--on-accent` is the text color used on top of `--accent` (primary button label). It is
  > near-white in light mode and near-black in dark mode because `--accent` lightens
  > considerably in dark mode to stay visible on the dark background, which would leave white
  > button text under the WCAG AA floor.

- [ ] **Step 2: Write the failing check script**

  Create `test-index.mjs`:

  ```js
  import { readFileSync } from 'node:fs';
  import assert from 'node:assert/strict';

  const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

  // --- WCAG contrast helpers ---
  function srgbToLinear(c) {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }
  function relativeLuminance(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = srgbToLinear((n >> 16) & 255);
    const g = srgbToLinear((n >> 8) & 255);
    const b = srgbToLinear(n & 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrastRatio(hexA, hexB) {
    const l1 = relativeLuminance(hexA);
    const l2 = relativeLuminance(hexB);
    const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (lighter + 0.05) / (darker + 0.05);
  }

  // --- Task 1: page shell + design tokens ---
  const tokens = {
    light: {
      bg: '#f6f4ec', surface: '#ffffff', text: '#161f18', textMuted: '#4d5850',
      accent: '#1f5c43', accentStrong: '#153f2e', onAccent: '#fbfdfb',
    },
    dark: {
      bg: '#10140f', surface: '#161c15', text: '#eae7db', textMuted: '#9fad9f',
      accent: '#59b98a', accentStrong: '#7fd1a6', onAccent: '#10140f',
    },
  };

  for (const [theme, t] of Object.entries(tokens)) {
    for (const hex of Object.values(t)) {
      assert.ok(html.includes(hex), `${theme} token ${hex} should appear in index.html`);
    }
  }

  assert.ok(
    contrastRatio(tokens.light.bg, tokens.light.text) >= 4.5,
    'light body text must meet WCAG AA against the page background'
  );
  assert.ok(
    contrastRatio(tokens.light.surface, tokens.light.textMuted) >= 4.5,
    'light muted text must meet WCAG AA against card surfaces'
  );
  assert.ok(
    contrastRatio(tokens.light.accent, tokens.light.onAccent) >= 4.5,
    'light primary button text must meet WCAG AA against the accent background'
  );
  assert.ok(
    contrastRatio(tokens.dark.bg, tokens.dark.text) >= 4.5,
    'dark body text must meet WCAG AA against the page background'
  );
  assert.ok(
    contrastRatio(tokens.dark.bg, tokens.dark.textMuted) >= 4.5,
    'dark muted text must meet WCAG AA against the page background'
  );
  assert.ok(
    contrastRatio(tokens.dark.accent, tokens.dark.onAccent) >= 4.5,
    'dark primary button text must meet WCAG AA against the accent background'
  );

  assert.match(html, /<title>SPII Overview<\/title>/, 'page must have the SPII Overview title');
  assert.match(html, /<html lang="en">/, 'page must declare English as the document language');
  assert.match(
    html,
    /<meta name="viewport" content="width=device-width, initial-scale=1">/,
    'page must have a responsive viewport meta tag'
  );
  assert.match(
    html,
    /@media \(prefers-color-scheme:\s*dark\)/,
    'page must define a dark theme via prefers-color-scheme'
  );
  assert.match(
    html,
    /@media \(prefers-reduced-motion:\s*reduce\)/,
    'page must respect prefers-reduced-motion'
  );

  console.log('Task 1 (shell + tokens): OK');
  ```

- [ ] **Step 3: Run the check script and confirm it fails**

  Run: `node test-index.mjs`
  Expected: throws `Error [ERR_MODULE_NOT_FOUND]` (or similar) because `index.html` doesn't
  exist yet.

- [ ] **Step 4: Write the minimal index.html to pass Task 1's assertions**

  Create `index.html`:

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SPII Overview</title>
  <meta name="description" content="An overview of the six deliverables of SPII, the Strategic Plan for Integrated Open Science Infrastructure.">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&family=IBM+Plex+Mono:wght@500&display=swap">
  <style>
    :root{
      --bg:#f6f4ec;
      --surface:#ffffff;
      --surface-2:#eeebdf;
      --text:#161f18;
      --text-muted:#4d5850;
      --accent:#1f5c43;
      --accent-strong:#153f2e;
      --accent-soft:#dfe9df;
      --on-accent:#fbfdfb;
      --border:#d9d4c3;
    }
    @media (prefers-color-scheme: dark){
      :root{
        --bg:#10140f;
        --surface:#161c15;
        --surface-2:#1c231b;
        --text:#eae7db;
        --text-muted:#9fad9f;
        --accent:#59b98a;
        --accent-strong:#7fd1a6;
        --accent-soft:#1e2c22;
        --on-accent:#10140f;
        --border:#2b342a;
      }
    }
    *{box-sizing:border-box;}
    body{
      margin:0;
      background:var(--bg);
      color:var(--text);
      font-family:"Outfit", system-ui, sans-serif;
      -webkit-font-smoothing:antialiased;
    }
    .wrap{
      max-width:1100px;
      margin:0 auto;
      padding-inline:20px;
    }
    @media (prefers-reduced-motion: reduce){
      *{transition:none !important; animation:none !important;}
    }
  </style>
  </head>
  <body>
  </body>
  </html>
  ```

- [ ] **Step 5: Run the check script and confirm it passes**

  Run: `node test-index.mjs`
  Expected: prints `Task 1 (shell + tokens): OK` and exits 0.

- [ ] **Step 6: Commit**

  ```bash
  git add index.html test-index.mjs docs/superpowers/specs/2026-09-16-index-page-design.md
  git commit -m "Add index.html shell and design tokens with a contrast-checked --on-accent"
  ```

---

### Task 2: Nav and hero (Option B — split hero with hexagon diagram)

**Files:**
- Modify: `test-index.mjs` (append Task 2 block)
- Modify: `index.html` (add `<nav>` and hero `<section>` inside `<body>`; add hero CSS to
  `<style>`)

**Interfaces:**
- Consumes: `--accent`, `--accent-soft`, `--surface`, `--surface-2`, `--text-muted`, `--border`,
  `--on-accent`, `.wrap` from Task 1.
- Produces: `href="#deliverables"` and `href="#about"` links in the nav (targets created in
  Tasks 3 and 4). Produces the exact hero headline/subtext strings later tasks and the spec
  treat as the approved copy.

- [ ] **Step 1: Append the failing assertions**

  Append to `test-index.mjs` (before the final line is fine, but keep each task's block
  together and add a fresh `console.log` at the end of the block):

  ```js
  // --- Task 2: nav + hero ---
  assert.match(html, /href="#deliverables"/, 'nav or hero must link to #deliverables');
  assert.match(html, /href="#about"/, 'nav or hero must link to #about');

  const heroHeadline = 'A coherent Open Science infrastructure for the Netherlands.';
  const heroSubtext = 'Six deliverables, one reference model. A shared framework, and the tools that put it into practice.';
  assert.ok(html.includes(heroHeadline), 'hero headline must match the approved copy');
  assert.ok(html.includes(heroSubtext), 'hero subtext must match the approved copy');
  assert.ok(
    heroSubtext.split(/\s+/).length <= 20,
    'hero subtext must stay at or under 20 words per the design spec'
  );
  assert.ok(html.includes('View the deliverables'), 'hero must include the primary CTA');
  assert.ok(html.includes('Read the background'), 'hero must include the secondary CTA');

  const hexagonCount = (html.match(/<polygon/g) || []).length;
  assert.equal(hexagonCount, 6, 'hero diagram must draw six hexagons (3 reference-model + 3 tools)');

  console.log('Task 2 (nav + hero): OK');
  ```

- [ ] **Step 2: Run and confirm the new assertions fail**

  Run: `node test-index.mjs`
  Expected: FAILS on the first new assertion (`href="#deliverables"` not found) — Task 1's
  block still prints its OK line first.

- [ ] **Step 3: Add the nav and hero to index.html**

  Insert inside `<body>`:

  ```html
  <nav class="wrap navbar">
    <div class="wordmark">SPII<span>.</span></div>
    <div class="navlinks">
      <a href="#deliverables">Deliverables</a>
      <a href="#about">About</a>
    </div>
  </nav>

  <section class="wrap hero">
    <div>
      <h1>A coherent Open Science infrastructure for the Netherlands.</h1>
      <p class="hero-sub">Six deliverables, one reference model. A shared framework, and the tools that put it into practice.</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="#deliverables">View the deliverables</a>
        <a class="btn btn-secondary" href="#about">Read the background</a>
      </div>
    </div>
    <div class="hero-diagram" aria-hidden="true">
      <svg viewBox="0 0 320 260" width="100%" height="auto" role="img" aria-label="Three connected hexagons representing the reference model, linked to three matching tool hexagons below">
        <g fill="none" stroke="var(--border)" stroke-width="1.5">
          <line x1="80" y1="70" x2="160" y2="70"/>
          <line x1="160" y1="70" x2="240" y2="70"/>
          <line x1="80" y1="70" x2="80" y2="180"/>
          <line x1="160" y1="70" x2="160" y2="180"/>
          <line x1="240" y1="70" x2="240" y2="180"/>
        </g>
        <g>
          <polygon points="80,45 97,57 97,83 80,95 63,83 63,57" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
          <polygon points="160,45 177,57 177,83 160,95 143,83 143,57" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
          <polygon points="240,45 257,57 257,83 240,95 223,83 223,57" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1.5"/>
          <polygon points="80,155 97,167 97,193 80,205 63,193 63,167" fill="var(--surface)" stroke="var(--text-muted)" stroke-width="1.5"/>
          <polygon points="160,155 177,167 177,193 160,205 143,193 143,167" fill="var(--surface)" stroke="var(--text-muted)" stroke-width="1.5"/>
          <polygon points="240,155 257,167 257,193 240,205 223,193 223,167" fill="var(--surface)" stroke="var(--text-muted)" stroke-width="1.5"/>
        </g>
      </svg>
    </div>
  </section>
  ```

  Add to `<style>`:

  ```css
  .navbar{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding-block:20px;
    border-bottom:1px solid var(--border);
  }
  .wordmark{font-weight:700; font-size:18px; letter-spacing:-0.01em;}
  .wordmark span{color:var(--accent);}
  .navlinks{display:flex; gap:28px; font-size:14.5px;}
  .navlinks a{color:var(--text-muted); text-decoration:none;}
  .navlinks a:hover{color:var(--text);}

  .hero{
    display:grid;
    grid-template-columns:1.1fr 0.9fr;
    gap:40px;
    align-items:center;
    padding-block:48px 64px;
  }
  .hero h1{
    font-size:clamp(30px, 5vw, 48px);
    line-height:1.08;
    letter-spacing:-0.02em;
    font-weight:600;
    text-wrap:balance;
    margin:0 0 20px;
  }
  .hero-sub{
    font-family:"Source Serif 4", Georgia, serif;
    font-size:18px;
    line-height:1.55;
    color:var(--text-muted);
    max-width:46ch;
    margin:0 0 28px;
  }
  .cta-row{display:flex; gap:14px; flex-wrap:wrap;}
  .btn{
    font-family:"Outfit", sans-serif;
    font-weight:600;
    font-size:15px;
    padding:12px 22px;
    border-radius:3px;
    text-decoration:none;
    display:inline-block;
  }
  .btn-primary{background:var(--accent); color:var(--on-accent);}
  .btn-secondary{background:transparent; color:var(--text); border:1px solid var(--border);}
  .hero-diagram{
    background:var(--surface-2);
    border:1px solid var(--border);
    border-radius:6px;
    padding:28px;
  }
  @media (max-width:760px){
    .hero{grid-template-columns:1fr;}
  }
  ```

- [ ] **Step 4: Run and confirm all assertions pass**

  Run: `node test-index.mjs`
  Expected: prints both `Task 1 (shell + tokens): OK` and `Task 2 (nav + hero): OK`.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html test-index.mjs
  git commit -m "Add nav and split hero (option B) with hexagon diagram"
  ```

---

### Task 3: Deliverables grid (the six cards + pairing connectors)

**Files:**
- Modify: `test-index.mjs` (append Task 3 block)
- Modify: `index.html` (add `<section id="deliverables">`; add grid CSS)

**Interfaces:**
- Consumes: `--surface`, `--accent`, `--text-muted`, `--border`, `.wrap` from Task 1; the
  `href="#deliverables"` nav target this section must satisfy (`id="deliverables"`).
- Produces: `id="deliverables"` anchor target (consumed by Task 2's nav link, already in place).

- [ ] **Step 1: Append the failing assertions**

  ```js
  // --- Task 3: deliverables grid ---
  assert.match(html, /id="deliverables"/, 'deliverables section must exist with id="deliverables"');

  const deliverables = [
    ['1A', 'Values and Principles', 'Shared values and principles that define a connected Open Science infrastructure.'],
    ['2A', 'Landscape &amp; Researcher Journey', 'A map of the ecosystem, seen through the path a researcher actually takes.'],
    ['3A', 'Capabilities &amp; Interoperability', 'The functions every component needs, and how they connect across domains.'],
    ['1B', 'Maturity Assessment Tool', 'Check how far an infrastructure component follows the shared principles.'],
    ['2B', 'Mapping of Infrastructures &amp; Projects', 'Existing components and projects, mapped to find overlaps and gaps.'],
    ['3B', 'Tool Box of Shared Tools', 'A shared set of reusable tools that put interoperability into practice.'],
  ];

  for (const [code, title, copy] of deliverables) {
    assert.ok(html.includes(`>${code}<`), `deliverable code ${code} must appear in its own element`);
    assert.ok(html.includes(title), `deliverable ${code} title "${title}" must appear`);
    assert.ok(html.includes(copy), `deliverable ${code} copy must appear verbatim`);
  }

  for (const code of deliverables.map((d) => d[0])) {
    const occurrences = html.split(`>${code}<`).length - 1;
    assert.equal(occurrences, 1, `deliverable code ${code} must appear exactly once`);
  }

  assert.match(html, /grid-template-columns:\s*1fr 1fr 1fr/, 'deliverables grid must use a three-column CSS grid');
  assert.match(html, /@media \(max-width:\s*768px\)/, 'deliverables grid must collapse to one column under 768px');

  console.log('Task 3 (deliverables grid): OK');
  ```

- [ ] **Step 2: Run and confirm the new assertions fail**

  Run: `node test-index.mjs`
  Expected: FAILS on `id="deliverables" must exist` (section doesn't exist yet).

- [ ] **Step 3: Add the deliverables grid to index.html**

  Insert after the hero `</section>`:

  ```html
  <section id="deliverables" class="wrap">
    <div class="section-head">
      <h2>The six deliverables</h2>
      <p>The reference model, top row, and its matching tool, bottom row. Each tool operationalises the piece directly above it.</p>
    </div>

    <div class="deliv-grid">
      <div class="card"><span class="code">1A</span><h3>Values and Principles</h3><p>Shared values and principles that define a connected Open Science infrastructure.</p></div>
      <div class="card"><span class="code">2A</span><h3>Landscape &amp; Researcher Journey</h3><p>A map of the ecosystem, seen through the path a researcher actually takes.</p></div>
      <div class="card"><span class="code">3A</span><h3>Capabilities &amp; Interoperability</h3><p>The functions every component needs, and how they connect across domains.</p></div>
    </div>

    <div class="connector-row" aria-hidden="true">
      <svg width="2" height="30"><line x1="1" y1="0" x2="1" y2="30" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3 3"/></svg>
      <svg width="2" height="30"><line x1="1" y1="0" x2="1" y2="30" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3 3"/></svg>
      <svg width="2" height="30"><line x1="1" y1="0" x2="1" y2="30" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3 3"/></svg>
    </div>

    <div class="deliv-grid">
      <div class="card"><span class="code">1B</span><h3>Maturity Assessment Tool</h3><p>Check how far an infrastructure component follows the shared principles.</p></div>
      <div class="card"><span class="code">2B</span><h3>Mapping of Infrastructures &amp; Projects</h3><p>Existing components and projects, mapped to find overlaps and gaps.</p></div>
      <div class="card"><span class="code">3B</span><h3>Tool Box of Shared Tools</h3><p>A shared set of reusable tools that put interoperability into practice.</p></div>
    </div>

    <div class="pair-caption">
      <span>1A &harr; 1B</span>
      <span>2A &harr; 2B</span>
      <span>3A &harr; 3B</span>
    </div>
  </section>
  ```

  Add to `<style>`:

  ```css
  .section-head{padding-block:8px 30px;}
  .section-head h2{font-size:clamp(24px, 3.4vw, 32px); letter-spacing:-0.01em; margin:0 0 10px;}
  .section-head p{font-family:"Source Serif 4", Georgia, serif; color:var(--text-muted); font-size:16.5px; max-width:60ch; margin:0;}
  .deliv-grid{display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px;}
  .card{background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:22px 20px;}
  .card .code{font-family:"IBM Plex Mono", monospace; font-size:12px; color:var(--accent); letter-spacing:.04em;}
  .card h3{font-size:17.5px; margin:8px 0 8px; letter-spacing:-0.01em;}
  .card p{font-size:14.5px; line-height:1.5; color:var(--text-muted); margin:0;}
  .connector-row{display:grid; grid-template-columns:1fr 1fr 1fr; justify-items:center; margin-block:4px;}
  .pair-caption{
    display:flex;
    justify-content:center;
    gap:28px;
    margin-top:26px;
    font-family:"IBM Plex Mono", monospace;
    font-size:13px;
    letter-spacing:.02em;
    color:var(--text-muted);
  }
  @media (max-width:768px){
    .deliv-grid, .connector-row{grid-template-columns:1fr;}
  }
  ```

  Note: `&harr;` (↔, a left-right arrow) is used for the 1A/1B pairing legend instead of a
  middot separator, per the taste-skill research notes in the spec ("middot rationed to max 1
  per line") — three middots on one line would violate that guardrail, so each pair gets its
  own arrow badge instead.

- [ ] **Step 4: Run and confirm all assertions pass**

  Run: `node test-index.mjs`
  Expected: prints Task 1, 2, and 3 OK lines.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html test-index.mjs
  git commit -m "Add deliverables grid with 1a-3b pairing connectors"
  ```

---

### Task 4: About and footer

**Files:**
- Modify: `test-index.mjs` (append Task 4 block)
- Modify: `index.html` (add `<section id="about">` and `<footer>`; add supporting CSS)

**Interfaces:**
- Consumes: `--text`, `--text-muted`, `--border`, `.wrap` from Task 1; the `href="#about"` nav
  target this section must satisfy (`id="about"`).
- Produces: `id="about"` anchor target (consumed by Task 2's nav link, already in place).

- [ ] **Step 1: Append the failing assertions**

  ```js
  // --- Task 4: about + footer ---
  assert.match(html, /id="about"/, 'about section must exist with id="about"');
  assert.ok(
    html.includes('Strategic Plan for Integrated Open Science Infrastructure'),
    'about section must spell out the SPII acronym'
  );
  assert.ok(
    html.includes('Towards a reference model for an open science infrastructure'),
    'about section must cite the source document'
  );
  assert.ok(html.includes('20-07-2026'), 'about section must cite the source document version date');
  assert.ok(html.includes('EUPL'), 'footer must mention the EUPL license');

  console.log('Task 4 (about + footer): OK');
  ```

- [ ] **Step 2: Run and confirm the new assertions fail**

  Run: `node test-index.mjs`
  Expected: FAILS on `id="about" must exist`.

- [ ] **Step 3: Add the about section and footer to index.html**

  Insert after the deliverables `</section>`, before `</body>`:

  ```html
  <section id="about" class="wrap">
    <div class="section-head">
      <h2>About SPII</h2>
      <p class="about-body">SPII, the Strategic Plan for Integrated Open Science Infrastructure, develops a plan for a coherent and connected Open Science infrastructure that supports researchers and institutions in practicing Open Science. The current Dutch landscape is fragmented: many universities, universities of applied sciences and national service providers are independently building parts of an Open Science infrastructure. SPII's response is a reference model, a broadly supported framework that describes the functions and relationships an infrastructure needs, while leaving room for each component's own implementation choices.</p>
      <p class="source-note">Source: Towards a reference model for an open science infrastructure (SPII, version 20-07-2026).</p>
    </div>
  </section>

  <footer class="wrap">
    <span>SPII, Strategic Plan for Integrated Open Science Infrastructure</span>
    <span>EUPL license</span>
  </footer>
  ```

  Add to `<style>`:

  ```css
  .about-body{
    font-family:"Source Serif 4", Georgia, serif;
    font-size:16.5px;
    line-height:1.6;
    color:var(--text);
    max-width:65ch;
    margin:0 0 14px;
  }
  .source-note{font-size:13.5px; color:var(--text-muted); margin:0;}
  footer{
    border-top:1px solid var(--border);
    margin-top:60px;
    padding-block:26px 50px;
    color:var(--text-muted);
    font-size:13.5px;
    display:flex;
    justify-content:space-between;
    flex-wrap:wrap;
    gap:10px;
  }
  ```

- [ ] **Step 4: Run and confirm all assertions pass**

  Run: `node test-index.mjs`
  Expected: prints Task 1 through 4 OK lines.

- [ ] **Step 5: Commit**

  ```bash
  git add index.html test-index.mjs
  git commit -m "Add about section and footer"
  ```

---

### Task 5: Final accessibility and copy pass

**Files:**
- Modify: `test-index.mjs` (append Task 5 block, the last one)
- Modify: `index.html` (fixes only if Step 2 finds violations — expected to already pass given
  Tasks 1-4 were written against these constraints, but this task is the enforcement point)

**Interfaces:**
- Consumes: the complete `index.html` produced by Tasks 1-4.
- Produces: nothing further; this is the final content gate before visual verification.

- [ ] **Step 1: Append the failing-by-construction assertions**

  ```js
  // --- Task 5: final accessibility + copy checks ---
  assert.ok(!html.includes('—'), 'page copy must contain zero em-dashes');
  assert.ok(
    !/100vh|100dvh/.test(html),
    'hero must be sized to its content, never forced to 100vh/100dvh (spec: show the page at rest)'
  );

  console.log('Task 5 (final accessibility + copy checks): OK');
  console.log('All checks passed.');
  ```

- [ ] **Step 2: Run the full check script**

  Run: `node test-index.mjs`
  Expected: all five task blocks print OK, ending with `All checks passed.` If anything fails
  here, it means an earlier task's copy or CSS drifted from the constraints (e.g. an em-dash
  crept into hand-typed copy) — fix `index.html` directly, not the assertion.

- [ ] **Step 3: Commit**

  ```bash
  git add index.html test-index.mjs
  git commit -m "Add final accessibility and copy checks to test-index.mjs"
  ```

---

### Task 6: Visual verification, housekeeping, and push

**Files:**
- Modify: `README.md` (drop the "(planned)" qualifier on `index.html`)
- Modify: `TODO.md` (check off completed "Build" items)

**Interfaces:**
- Consumes: the finished `index.html` from Tasks 1-5.
- Produces: nothing further; this is the last task in the plan.

- [ ] **Step 1: Visual verification in the browser**

  Use the `run` skill to serve this repo and capture screenshots of `index.html` at:
  - Desktop width (1280px), light mode
  - Desktop width (1280px), dark mode (emulate `prefers-color-scheme: dark`)
  - Mobile width (390px), light mode

  For each screenshot, check against this list (derived from the design spec):
  - Hero headline and subtext are fully visible without scrolling, CTAs visible, no clipped
    or overlapping text
  - Nav renders on a single line
  - All six deliverable cards are visible with matching heights within their row
  - The three connectors between row 1 and row 2 line up under their matching columns
  - Text is legible against its background in both themes (spot-check, the automated contrast
    check in Task 1 already covers the token math)
  - At 390px, the deliverables grid is a single column and nothing overflows horizontally

  If anything on this list fails, fix `index.html` and re-run `node test-index.mjs` before
  re-capturing.

- [ ] **Step 2: Update README.md**

  In `README.md`, under "Repository contents", change:

  ```markdown
  - `index.html` *(planned)* — the published overview page (GitHub Pages)
  ```

  to:

  ```markdown
  - `index.html` — the published overview page (GitHub Pages)
  ```

- [ ] **Step 3: Update TODO.md**

  In `TODO.md`, under "## Build (`index.html` via GitHub Pages)", check off:

  ```markdown
  - [x] Use the `using-superpowers` skill workflow (and a design/taste skill) to design and build
        `index.html`
  - [x] Layout: 2 rows × 3 columns, reference model (1a-3a) on top, matching tools (1b-3b) below,
        with the 1↔1, 2↔2, 3↔3 pairing visually clear
  - [x] Single self-contained static file, no build step
  ```

  Leave "Enable GitHub Pages for this repo (Settings -> Pages)" and "Verify the published page"
  unchecked — those need a repository admin action outside this session (see Step 5).

- [ ] **Step 4: Commit and push**

  ```bash
  git add README.md TODO.md
  git commit -m "Mark index.html done in README and TODO"
  git push -u origin claude/surf-ori-spii-overview-access-50vxju
  ```

- [ ] **Step 5: Flag the manual GitHub Pages step**

  This session's GitHub access does not include a repository-settings/Pages-configuration
  tool. Tell the user that an org owner or repo admin (e.g. `mosart`, per the collaborator
  list checked earlier in this conversation) needs to enable GitHub Pages once this branch is
  merged: repo Settings -> Pages -> Source: "Deploy from a branch" -> Branch: `main` -> folder
  `/ (root)`. Until that's done, `index.html` exists in the repo but isn't served anywhere.

---

## Self-Review

- **Spec coverage:** hero option B (Task 2), page structure nav/hero/deliverables/about/footer
  (Tasks 2-4), design tokens incl. the `--on-accent` gap found during contrast verification
  (Task 1), content mapping table (Task 3), accessibility/em-dash/100vh constraints (Task 5),
  visual QA (Task 6). GitHub Pages enablement is explicitly out of this session's tool access
  and called out rather than silently skipped (Task 6, Step 5).
- **Placeholder scan:** no TBD/TODO markers; every step has literal code or an exact command.
- **Type/name consistency:** `contrastRatio`/`relativeLuminance` defined once in Task 1, not
  redefined later. Token names (`--on-accent` etc.) match between the spec addendum, the CSS,
  and the check script across all tasks. Deliverable codes/titles/copy are identical strings
  in Task 3's assertions and its HTML.
