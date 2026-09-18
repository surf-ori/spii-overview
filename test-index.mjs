import { readFileSync, readdirSync, existsSync } from 'node:fs';
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

// --- Task 2: nav + hero ---
assert.match(html, /href="#deliverables"/, 'nav or hero must link to #deliverables');
assert.match(html, /href="#about"/, 'nav or hero must link to #about');

const heroHeadline = 'A coherent and connected Open Science infrastructure for the Netherlands.';
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

// --- Task 3: deliverables grid ---
assert.match(html, /id="deliverables"/, 'deliverables section must exist with id="deliverables"');

const deliverables = [
  ['1A', 'Values and Principles', 'Shared values and principles that define a connected Open Science infrastructure.'],
  ['2A', 'Landscape &amp; Researcher Journey', 'A map of the ecosystem, seen through the path a researcher actually takes.'],
  ['3A', 'Capabilities &amp; Interoperability', 'The functions every component needs, and how they connect across domains.'],
  ['1B', 'Principles Alignment Tool', 'Check how far an infrastructure component follows the shared principles.'],
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

// --- Task 5: final accessibility + copy checks ---
assert.ok(!html.includes('—'), 'page copy must contain zero em-dashes');
assert.ok(
  !/100vh|100dvh/.test(html),
  'hero must be sized to its content, never forced to 100vh/100dvh (spec: show the page at rest)'
);

console.log('Task 5 (final accessibility + copy checks): OK');

// --- Final-review fix verification ---
assert.ok(!html.includes('fonts.googleapis.com'), 'fonts must be self-hosted, not loaded from Google Fonts');
assert.ok(html.includes('<main>') || html.includes('<main '), 'page must have a <main> landmark');

const fontFiles = readdirSync(new URL('./fonts/', import.meta.url)).filter((f) => f.endsWith('.woff2'));
assert.ok(fontFiles.length >= 3, 'fonts/ must contain the self-hosted woff2 files');

console.log('Final-review fixes: OK');
console.log('All checks passed.');
