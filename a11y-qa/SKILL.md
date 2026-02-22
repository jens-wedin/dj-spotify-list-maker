---
name: a11y-qa
version: "1.0"
description: >
  Accessibility testing and auditing skill for QA engineers. Runs automated scans
  with axe-core and eslint-plugin-jsx-a11y, classifies violations by severity,
  produces structured reports, and provides manual test checklists.
  Triggers: "run accessibility audit", "check WCAG compliance", "accessibility test",
  "a11y-qa", "a11y-audit", "accessibility-qa", "test accessibility", "audit a11y"
group: accessibility
---

# Accessibility QA Testing

You are helping a QA engineer systematically find, classify, and report accessibility
violations. Your job is to surface real issues clearly so developers can fix them.

---

## Step 1: Choose a Scan Mode

Ask the user which mode to use if not specified:

| Mode | What it does | When to use |
|------|-------------|-------------|
| **runtime** | Injects axe-core into running pages via browser | Final QA, staging, before release |
| **static** | Runs eslint-plugin-jsx-a11y on source code | During development, PR review |
| **full** | Static first, then runtime | Comprehensive release audit |

Default to **runtime** unless the user specifies otherwise or no dev server is available.

---

## Step 2: Runtime Scan (axe-core)

Tests the live rendered page — catches issues that only appear at runtime (dynamic
content, third-party components, CSS-driven visibility).

**Standards:** WCAG 2.1 Level AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`) + best practices.

### 2a. Discover pages to scan

Look for routes in the project:
- **Next.js (App Router):** `src/app/**/page.tsx`
- **Next.js (Pages Router):** `pages/**/*.tsx`
- **React Router:** route definitions file
- **Static site:** `*.html` files or `sitemap.xml`
- Ask the user if the route list is unclear.

### 2b. Start the dev server

```bash
# Detect the right command from package.json "scripts"
# Usually: dev, start, or serve
npm run dev   # or pnpm dev / yarn dev
```

Wait for HTTP 200 on `localhost` before proceeding.

### 2c. Inject axe-core and scan each page

For each page, use browser automation to:
1. Navigate to the page URL
2. Wait 2–3 seconds for content to fully render
3. Run this script:

```javascript
(async () => {
  if (!window.axe) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => { script.onload = resolve; });
  }
  const results = await axe.run(document, {
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
  });
  window.__axeResults = {
    page: window.location.pathname,
    violations: results.violations.length,
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    details: results.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      elements: v.nodes.slice(0, 5).map(n => ({
        html: n.html.substring(0, 200),
        target: n.target,
        failureSummary: n.failureSummary
      }))
    }))
  };
})().then(() => console.log('AXE_SCAN_DONE'));
```

4. Wait 3 seconds, then retrieve `window.__axeResults`.

### 2d. Kill the dev server

After all pages are scanned, stop the background server process.

---

## Step 3: Static Analysis (ESLint jsx-a11y)

Catches source-level issues in JSX/TSX without needing a running server. Best for React,
Next.js, and Vue projects.

### 3a. Check for eslint-plugin-jsx-a11y

Look in `package.json` devDependencies. If not present, install it:

```bash
pnpm add -D eslint-plugin-jsx-a11y   # or npm install -D / yarn add -D
```

### 3b. Create a temporary standalone config

```javascript
// eslint.a11y.mjs  (create at project root, delete after scan)
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.tsx", "src/**/*.jsx"],
    plugins: { "jsx-a11y": jsxA11y },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: { ...jsxA11y.flatConfigs.recommended.rules },
  },
];
```

### 3c. Run the scan

```bash
npx eslint --config eslint.a11y.mjs src/
```

### 3d. Clean up

Remove `eslint.a11y.mjs` after the scan. Keep `eslint-plugin-jsx-a11y` installed.

### 3e. Flag known false positives

Do not report these as real violations:
- Custom component props named `role` (not the HTML `role` attribute)
- Components that forward ARIA props to underlying elements
- Dynamic content loaded after initial render (use runtime scan for those)

---

## Step 4: Classify Violations by Severity

Every axe-core violation carries an impact level. Use this to prioritise fixes:

| Impact | Meaning | Action |
|--------|---------|--------|
| **critical** | Completely blocks assistive technology users | Fix before release |
| **serious** | Causes significant difficulty for AT users | Fix before release |
| **moderate** | Causes some difficulty, workarounds exist | Fix in current sprint |
| **minor** | Small issue, low impact | Fix when convenient |

---

## Step 5: Auto-Fix Reference

When reporting violations, include the recommended fix from this table:

| Violation rule | Fix |
|----------------|-----|
| `region` — content not in landmark | Wrap in `<main>`, put nav in `<nav>`, footer in `<footer>` |
| `heading-order` — skipped levels | Fix heading level; use CSS to style visually, not heading number |
| `color-contrast` — insufficient contrast | Adjust colors to meet 4.5:1 (normal text) or 3:1 (large text / UI) |
| `image-alt` — missing alt text | Add descriptive `alt`; use `alt=""` for decorative images |
| `button-name` — nameless button | Add visible text, `aria-label`, or `aria-labelledby` |
| `link-name` — nameless link | Add text content or `aria-label` (avoid "click here") |
| `label` — form control without label | Add `<label htmlFor="id">` or wrap input in `<label>` |
| `aria-*` — invalid ARIA | Fix attribute name, value, or role to match ARIA spec |
| `duplicate-id` | Make all IDs unique per page |
| `focus-order-semantics` | Fix DOM order; use CSS for visual reorder, not `tabindex` |
| `keyboard` — not keyboard accessible | Ensure all interactions work with Tab, Enter, Space, Esc |

---

## Step 6: Generate the Report

Always present findings in this structure:

```
## Accessibility Audit Results

**Scan mode:** [runtime / static / full]
**Standards:** WCAG 2.1 Level AA + Best Practices
**Date:** [date]
**Pages / files scanned:** [count]

### Summary

| Page / File | Violations | Passes | Worst impact |
|-------------|-----------|--------|--------------|
| /           | 3         | 42     | serious      |
| /about      | 1         | 39     | moderate     |

**Total violations:** [n]
Critical: [n] | Serious: [n] | Moderate: [n] | Minor: [n]

---

### Violations

#### 1. [rule-id] — [impact]

**Description:** [what the rule checks]
**WCAG criterion:** [e.g. 1.1.1 Non-text Content (Level A)]
**Pages / files affected:** [list]
**Instances:** [count]

**Example element:**
```html
<element that failed>
```

**Fix:** [specific recommendation from auto-fix table above]
**Reference:** [axe-core help URL]

---

### Recommended Next Steps

1. [Highest-priority fix]
2. [Second priority]
3. [etc.]
```

---

## Step 7: Manual Test Checklist

Automated tools find ~30–40% of accessibility issues. Complete this manual checklist
for the pages under test:

### Keyboard-Only Navigation

- [ ] Tab from the top of the page to the bottom — every interactive element receives focus
- [ ] Focus indicator is always visible (never disappears)
- [ ] Tab order matches visual reading order
- [ ] Skip link appears and works (keyboard users bypass navigation)
- [ ] Modal / dialog: Tab stays trapped inside while open; Escape closes it and returns focus to the trigger
- [ ] Custom widgets (sliders, date pickers, tabs): arrow keys work as expected

### Screen Reader Testing

Test with at least one of: NVDA + Chrome (Windows), VoiceOver + Safari (macOS/iOS),
TalkBack (Android).

- [ ] Page `<title>` is descriptive and unique per page
- [ ] `<html lang="…">` is set correctly
- [ ] Heading structure makes sense when read in sequence (h1 → h2 → h3)
- [ ] All images are announced with meaningful alt text (decorative images are skipped)
- [ ] All form fields announce their label and any error messages
- [ ] Error messages are announced immediately on validation (not only visually highlighted)
- [ ] Dynamic content changes (loaded data, toasts, status) are announced via live regions
- [ ] Link text is descriptive out of context (no "click here" or "read more" alone)
- [ ] Buttons announce their purpose

### Visual / Cognitive Checks

- [ ] Zoom to 200% — no content is clipped, truncated, or overlaps
- [ ] Zoom to 400% — page is still usable (scrolls, no horizontal scroll for text)
- [ ] Color is never the only way to convey information (errors also have icons or text)
- [ ] All text meets contrast ratio: 4.5:1 normal, 3:1 large text
- [ ] Animated content can be paused, stopped, or hidden (WCAG 2.2.2)
- [ ] Session timeouts warn the user with enough time to extend

### Touch / Mobile

- [ ] All interactive targets are at least 24×24 px (WCAG 2.5.8 minimum) / 44×44 px recommended
- [ ] No functionality relies on hover only
- [ ] Pinch-zoom is not disabled (`user-scalable=no` is absent)

---

## Step 8: WCAG 2.2 AA Quick Reference

Key success criteria testers should verify:

| Criterion | Level | What to check |
|-----------|-------|---------------|
| 1.1.1 Non-text Content | A | All images, icons, charts have text alternatives |
| 1.3.1 Info and Relationships | A | Structure (headings, lists, tables) conveyed in markup |
| 1.3.2 Meaningful Sequence | A | Reading order in DOM matches visual order |
| 1.4.1 Use of Color | A | Color is not the sole visual indicator |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 normal text, 3:1 large text |
| 1.4.4 Resize Text | AA | Text scales to 200% without loss of content |
| 1.4.10 Reflow | AA | Content reflows at 400% zoom, no horizontal scroll |
| 1.4.11 Non-text Contrast | AA | UI components and focus indicators meet 3:1 |
| 1.4.12 Text Spacing | AA | No loss of content when letter/word/line spacing increased |
| 2.1.1 Keyboard | A | All functionality operable by keyboard |
| 2.1.2 No Keyboard Trap | A | Focus can always be moved away with keyboard |
| 2.4.3 Focus Order | A | Focus order preserves meaning and operability |
| 2.4.4 Link Purpose | A | Link purpose clear from text or context |
| 2.4.7 Focus Visible | AA | Keyboard focus indicator is visible |
| 2.4.11 Focus Appearance | AA (2.2) | Focus indicator meets minimum size and contrast |
| 2.5.3 Label in Name | A | Visible label text is included in accessible name |
| 2.5.8 Target Size (Minimum) | AA (2.2) | Interactive targets at least 24×24 px |
| 3.1.1 Language of Page | A | `<html lang="…">` is set |
| 3.3.1 Error Identification | A | Errors identified in text, not just color |
| 3.3.2 Labels or Instructions | A | All form fields have labels |
| 4.1.2 Name, Role, Value | A | All UI components have name, role, and state in markup |
| 4.1.3 Status Messages | AA | Status messages announced without focus (live regions) |
