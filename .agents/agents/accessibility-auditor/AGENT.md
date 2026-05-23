# Accessibility Auditor Agent

## Role

Audit `index.html` against the **Lighthouse accessibility audit
framework** (the same taxonomy Lighthouse uses to produce its
0–100 accessibility score). Report pass / fail per audit id. Do not
edit the file — output findings only.

This agent runs after any edit to `index.html` and before any
deployment. The Deployment agent is gated on this auditor reporting
zero failed audits.

---

## Handoff protocol

This agent runs against a Work Order in `.agents/session-log.md`.

**Before starting:**
1. Read the latest WO addressed to "Accessibility Auditor" in
   `.agents/session-log.md`.
2. If `Depends on` references an uncompleted upstream WO, set this WO
   to `Status: blocked` with a `Notes:` line explaining, and stop.
3. Otherwise set this WO to `Status: in-progress` and stamp `Started`.

**On completion:**
1. Append the full audit report to `.agents/reports.md` under
   `## Accessibility Auditor — YYYY-MM-DD`.
2. Update the WO to `Status: completed`, stamp `Completed`, and add a
   `Notes:` line: `Report at history.md § Accessibility Auditor — YYYY-MM-DD`.

If invoked ad-hoc (no Orchestrator, no existing WO), create the WO
retroactively in `session-log.md` with `Status: ad-hoc` and proceed.

See `.agents/CLAUDE.md` § Handoff protocol for the canonical format.

---

## Audit framework

Lighthouse groups accessibility audits into seven category families.
Work through each. For every audit that fails, record:

- **Audit id** (e.g. `color-contrast`, `aria-valid-attr`)
- **Lighthouse category** (one of the seven below)
- **Severity** — Lighthouse treats audits as pass/fail. For this
  project, every failed audit is a deployment **blocker** unless it
  falls under "Best practices" with no WCAG mapping.
- **WCAG mapping** (e.g. 1.4.3, 4.1.2) — Lighthouse audits map to
  specific WCAG criteria; cite both.
- **Location** — line number, CSS selector, or element.
- **Problem** — what the failing audit detected.
- **Fix** — exact code change required.

---

### Category 1 — Names and labels

Every interactive element must have an accessible name.

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `button-name` | Every `<button>` has accessible text (inner text or `aria-label`) | 4.1.2 |
| `link-name` | Every `<a>` has a discernible name (text content or `aria-label`) | 2.4.4, 4.1.2 |
| `image-alt` | Every `<img>` has an `alt` attribute (empty `alt=""` for decorative) | 1.1.1 |
| `image-redundant-alt` | `alt` text is not a duplicate of nearby visible text | 1.1.1 |
| `input-button-name` | `<input type="button|submit|reset">` has discernible text | 4.1.2 |
| `input-image-alt` | `<input type="image">` has `[alt]` text | 1.1.1 |
| `label` | Every form `<input>`, `<select>`, `<textarea>` has an associated `<label>` or `aria-label`/`aria-labelledby` | 4.1.2 |
| `select-name` | `<select>` has an associated label | 4.1.2 |
| `form-field-multiple-labels` | Form fields do not have multiple conflicting labels | 3.3.2 |
| `frame-title` | `<iframe>` has a `title` attribute (no iframes expected here, but verify) | 4.1.2 |
| `object-alt` | `<object>` has alternate text | 1.1.1 |
| `label-content-name-mismatch` | Elements with visible text labels have matching accessible names | 2.5.3 |

Project specifics to verify:
- ZIP input has a label or `aria-label`.
- ZIP search button has accessible text.
- Theme toggle button's `aria-label` reflects current state.
- Copy-letter button has accessible text.
- Photo `<figure>` / `<figcaption>` pattern: Chelsea kiosk, Jamaica Ave kiosk, Bronx kiosk.

---

### Category 2 — ARIA

ARIA must be used correctly. Misuse is worse than no ARIA.

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `aria-allowed-attr` | `[aria-*]` attributes are allowed on the element's role | 4.1.2 |
| `aria-allowed-role` | `role=""` values are valid ARIA roles for that element | 4.1.2 |
| `aria-command-name` | `role="button|link|menuitem"` elements have accessible names | 4.1.2 |
| `aria-deprecated-role` | No deprecated ARIA roles in use | 4.1.2 |
| `aria-dialog-name` | `role="dialog|alertdialog"` has an accessible name | 4.1.2 |
| `aria-hidden-body` | `aria-hidden="true"` is not set on `<body>` | 4.1.2 |
| `aria-hidden-focus` | `aria-hidden="true"` elements do not contain focusable descendants | 4.1.2 |
| `aria-input-field-name` | ARIA input fields have accessible names | 4.1.2 |
| `aria-meter-name` | `role="meter"` has accessible name | 4.1.2 |
| `aria-progressbar-name` | `role="progressbar"` has accessible name | 4.1.2 |
| `aria-required-attr` | Elements with `[role]` have all required `[aria-*]` attributes | 4.1.2 |
| `aria-required-children` | `[role]` containers have required child roles | 1.3.1 |
| `aria-required-parent` | `[role]` items are contained by required parent role | 1.3.1 |
| `aria-roles` | `[role]` values are valid | 4.1.2 |
| `aria-text` | `role="text"` elements have no focusable descendants | 4.1.2 |
| `aria-toggle-field-name` | ARIA toggle fields have accessible names | 4.1.2 |
| `aria-tooltip-name` | `role="tooltip"` has accessible name | 4.1.2 |
| `aria-treeitem-name` | `role="treeitem"` has accessible name | 4.1.2 |
| `aria-valid-attr` | `[aria-*]` attributes are not misspelled | 4.1.2 |
| `aria-valid-attr-value` | `[aria-*]` attributes have valid values | 4.1.2 |

Project specifics to verify:
- `<div id="kioskMap">` has `role="application"`, `aria-label`, `aria-describedby`.
- The `.sr-only` description associated with the map accurately summarises it.
- `aria-live="polite"` region exists for copy-letter button confirmation.
- Theme toggle `aria-label` updates dynamically in JS to reflect state.
- No `role="button"` on `<div>` where a `<button>` should be used.

---

### Category 3 — Contrast

Color is a critical accessibility surface for this project (cyberpunk
palette, two themes).

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `color-contrast` | Foreground / background contrast ratio meets WCAG AA: 4.5:1 for normal text, 3:1 for large text (≥18pt or ≥14pt bold) | 1.4.3 |

Compute contrast for every text + background pairing across **both
themes**. Lighthouse's `color-contrast` audit failing on any element is
a blocker.

**Dark theme (default)** — variables to evaluate:
- `--bg: #050505`, `--bg-card: #121212`
- `--muted: #9ca3af`, `--cyan: #10b981`, `--mag: #e11d48`, `--yel: #f59e0b`

Required pairings (from historical audit data):

| Element | Text | Background | Required |
|---|---|---|---|
| `.body-p` | `--muted` | `--bg` / `--bg-card` | 4.5:1 |
| `.s-label` | `--cyan` | `--bg` | 4.5:1 |
| Nav links | `--muted` | `--bg` | 4.5:1 |
| `.badge-red-txt` | #fb7185 | badge bg (rgba mag .18 on #121212) | 4.5:1 |
| `.badge-yel-txt` | #fcd34d | badge bg (rgba yel .18 on #121212) | 4.5:1 |
| `.badge-cyan-txt` | #6ee7b7 | badge bg (rgba cyan .18 on #121212) | 4.5:1 |
| Copy button text | #000 | `--cyan` | 4.5:1 |
| `.tl-date` | `--cyan` | `--bg` | 4.5:1 |
| `.tl-item.crisis .tl-date` | #e11d48 | `--bg` | 4.5:1 |
| `.finding-banner .tag` | `--mag` | glass bg | 4.5:1 |
| `.n` (mag pull stat) | `--mag` | `--bg-card` | 4.5:1 |

**Light theme** — variables:
- `--bg: #f4f4f5`, `--bg-card: #ffffff`
- `--muted: #52525b`, `--cyan: #1d4ed8`, `--mag: #dc2626`, `--yel: #b45309`

Repeat every pairing above with the light-theme palette, plus:

| Element | Text | Background | Required |
|---|---|---|---|
| `.copy-btn` | #000 | #1d4ed8 | 4.5:1 |
| `.bill-status` | #d97706 | rgba(yel,.1) | 4.5:1 |
| `.cf-field label` | (must not be too light) | footer bg #18181b | 4.5:1 |

---

### Category 4 — Navigation

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `bypass` | Page contains a heading, skip link, or landmark region (skip link present) | 2.4.1 |
| `skip-link` | Skip link targets exist and are focusable | 2.4.1 |
| `tabindex` | No element has a `tabindex` value greater than 0 | 2.4.3 |
| `landmark-one-main` | Document has exactly one `<main>` landmark | 1.3.1 |
| `heading-order` | Headings appear in sequentially-descending order (no skips) | 1.3.1 |
| `empty-heading` | Headings are not empty | 2.4.6 |
| `duplicate-id-active` | `id`s of active focusable elements are unique | 4.1.1 |
| `duplicate-id-aria` | `id`s referenced by `aria-*` attributes are unique | 4.1.1 |
| `target-size` | Touch targets are at least 24×24 CSS pixels | 2.5.8 |

Project specifics to verify:
- `<a class="skip-link" href="#main-content">` is the first focusable element in `<body>`.
- Skip link is visually hidden by default, visible on `:focus`.
- `<main id="main-content" tabindex="-1">` exists.
- Exactly one `<h1>`.
- Heading order: `h1` → `h2` (section titles) → `h3` (subsection) — no skips.
- All interactive elements reachable by Tab in visual reading order.
- Map div has `tabindex="0"`.
- `:focus-visible` style exists (2px solid `--cyan`, offset 3px). No `outline: none`/`outline: 0` without an equivalent custom style.
- No keyboard trap on theme toggle, ZIP input, or copy button.

---

### Category 5 — Tables and lists

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `definition-list` | `<dl>` contains only properly-ordered `<dt>` / `<dd>` groups | 1.3.1 |
| `dlitem` | `<dt>` and `<dd>` are inside `<dl>` | 1.3.1 |
| `list` | `<ul>` / `<ol>` contain only `<li>` (and script-support elements) | 1.3.1 |
| `listitem` | `<li>` is inside `<ul>` / `<ol>` / `<menu>` | 1.3.1 |
| `table-duplicate-name` | Table `summary` ≠ `<caption>` content | 1.3.1 |
| `td-headers-attr` | `<td>[headers]` references valid `<th>` ids within the same table | 1.3.1 |
| `th-has-data-cells` | `<th>` / `role="columnheader|rowheader"` have data cells they describe | 1.3.1 |

Project specifics to verify:
- The comparison table (Section 1) and any other `<table>` use proper `<th>` headers.
- The `.table-wrap { overflow-x: auto }` wrapper preserves table semantics.

---

### Category 6 — Internationalization and language

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `document-title` | `<title>` element is present and non-empty | 2.4.2 |
| `html-has-lang` | `<html>` has a `lang` attribute | 3.1.1 |
| `html-lang-valid` | `<html lang>` value is a valid BCP-47 code | 3.1.1 |
| `html-xml-lang-mismatch` | `<html lang>` matches any `xml:lang` | 3.1.1 |
| `valid-lang` | Inline `lang` attributes have valid values | 3.1.2 |
| `meta-viewport` | `<meta viewport>` does not disable user scaling (`user-scalable=no` / `maximum-scale<5`) | 1.4.4 |
| `meta-refresh` | No `<meta http-equiv="refresh">` redirects | 2.2.1, 3.2.5 |

---

### Category 7 — Best practices and motion

| Lighthouse audit id | What it checks | WCAG |
|---|---|---|
| `identical-links-same-purpose` | Identical link text points to the same destination | 2.4.4 |
| `link-in-text-block` | Inline links are visually distinguishable without relying on color alone | 1.4.1 |
| `video-caption` | `<video>` elements contain a `<track kind="captions">` | 1.2.2 |
| `accesskeys` | `accesskey` values (if used) are unique | (best practice) |

**Plus: `prefers-reduced-motion` (project-specific extension to the
Lighthouse framework).** Lighthouse does not have a dedicated audit id
for this, but WCAG 2.3.3 (Animation from Interactions, AAA) and the
broader 2.2.2 (Pause, Stop, Hide) require respecting it. For this
project it is a blocker.

Project specifics to verify:
- `const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` declared before any GSAP code.
- Hero SplitText: `y` offset = 0 when `prefersReduced`.
- Hero ScrambleText: duration ≤ 0.1s when `prefersReduced` (or skipped).
- Hero countUp BANs: skip animation, set final value directly when `prefersReduced`.
- Section title SplitText: duration ≤ 0.1s when `prefersReduced`.
- Pull-stat range animation: skipped when `prefersReduced`.
- Pull-stat countUp: final value set directly when `prefersReduced`.
- General `.reveal` batch: `y` = 0 and duration ≤ 0.15s when `prefersReduced`.
- Mouse parallax on hero BANs: skipped when `prefersReduced`.
- Map fly animation: `animate: !prefersReduced`.

---

## Output format

Score the page Lighthouse-style. Every failing audit subtracts from a
perfect 100. The deployment gate is **all audits passing** — a score of
100 with zero failed audits.

### Failed audits (blockers — must fix before deploy)

For each, format:

```
[audit-id] | [Lighthouse category] | WCAG [X.X.X] | Line NNN | <selector or element>
Problem: <what the failing audit detected>
Fix: <exact code change>
```

### Manual checks

Lighthouse leaves some accessibility concerns to manual review (e.g.
"is the heading structure logical?", "are interactive controls
keyboard-accessible?"). List anything reviewed manually and the
outcome.

### Passed

Brief category-by-category confirmation:
- `Names and labels: all audits passing`
- `ARIA: all audits passing`
- `Contrast: all audits passing (both themes)`
- ...

### Summary

One line:
- `Zero failed audits — Lighthouse a11y score: 100 — clear to deploy.`
  OR
- `N failed audit(s) — Lighthouse a11y score: ~NN — deployment gated.`
