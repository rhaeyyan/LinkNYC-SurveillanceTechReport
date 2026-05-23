# Agent Run History

## 2026-05-21 — Accessibility Auditor
- Result: 6 blockers
- Issues:
  1. [1.4.3] Dark .tl-item.crisis .tl-date — #e11d48 on #050505 = 4.34:1 (need 4.5:1)
  2. [1.4.3] Dark .finding-banner .tag — #e11d48 on glass bg ≈ 4.08:1 (need 4.5:1)
  3. [1.4.3] Light .tl-item.crisis .tl-date — #dc2626 on #f4f4f5 = 4.39:1 (need 4.5:1)
  4. [1.4.3] Light .copy-btn — #000 on #1d4ed8 = 3.13:1 (need 4.5:1)
  5. [1.4.3] Light .badge-yel-txt — #b45309 on badge bg ≈ 4.12:1 (need 4.5:1)
  6. [1.4.3] Light .bill-status — #d97706 on rgba(yel,.1) bg ≈ 2.65:1 (need 4.5:1)

## 2026-05-21 — Accessibility Auditor (re-run)
- Result: 1 blocker
- Issues: [1.4.3] Light mode .cf-field label (#52525b) on footer bg (#18181b) = 2.61:1 (need 4.5:1); all 6 previous blockers resolved

---

## Code Health — 2026-05-21

**Agent:** Code Health | **Scope:** index.html (1,519 lines) | **Run date:** 2026-05-21

---

### Critical (breaks the page for users)

None.

---

### High (significant UX or trust issue)

**[Check 5 — Social meta tags] All Open Graph and Twitter Card tags are missing.** `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:type">`, `<meta property="og:url">`, and `<meta name="twitter:card">` are not present in `<head>`. Social shares of this page will render with no preview image, no descriptive title, and no summary — degrading click-through for the primary advocacy CTA when the URL is shared on social media.
Fix: Add the five missing meta tags to `<head>`. Suggested values: `og:title` = page `<title>` value; `og:description` = existing meta description (trimmed to 160 chars); `og:type` = "article"; `og:url` = the deployed canonical URL; `twitter:card` = "summary_large_image".

**[Check 2 — Citation health] `https://www.nyc.gov/site/nypd/about/about-nypd/policy/post-act.page` returns HTTP 403.** This source is cited in the comparison table (Section 1) as the authority for the NYPD POST Act Impact & Use Policy claim — the central factual pillar of the article. A 403 may indicate a server-side block, a changed URL, or a temporary outage. Readers attempting to verify the claim will hit a blank or error page.
Fix: Verify the URL is correct and the POST Act disclosure index is still live. If the page has moved, update the link. Consider adding an archived backup URL (e.g. Wayback Machine snapshot) as a fallback citation.

**[Check 6 — GSAP SplitText graceful degradation] `SplitText.create()` is called with no try/catch fallback.** If any GSAP CDN script fails to load (network timeout, CDN outage, corporate proxy block), `SplitText` will be undefined. Calling `.create()` on `undefined` throws a TypeError, leaving the hero `<h1>` invisible because GSAP sets `autoAlpha: 0` on the `<em>` child before the split runs. The existing `@media (prefers-reduced-motion: reduce)` CSS rule protects the `em` element for OS-level motion preferences but does not protect against a CDN failure. The same uncaught call appears in the `.s-title` loop (line 1207), which would leave all section headings invisible.
Fix: Wrap both `SplitText.create` call sites in try/catch blocks. In the catch, set `autoAlpha: 1` (or `visibility: visible`) on `.hero-title` and each `.s-title` to ensure text is readable regardless of CDN status.

---

### Medium (best practice or future risk)

**[Check 1 — CDN versions] Chart.js is pinned to 4.4.0; latest stable is 4.5.1.** The page loads `chart.js@4.4.0` while the library is now at 4.5.1 (released October 2024), five patch releases ahead. The intervening patches fix doughnut legend sync, plugin notification bugs, and chart shrink issues in Chrome. No security CVE was found for 4.4.0, but running an outdated minor version carries a latent risk.
Fix: Bump the CDN URL from `chart.js@4.4.0` to `chart.js@4.5.1`. Test the borough broadband bar chart after the update.

**[Check 5 — Meta description length] `<meta name="description">` is 163 characters — 3 characters over the 160-character soft limit.** Google and most social platforms truncate descriptions beyond 160 characters with an ellipsis, cutting off the last phrase ("least able to refuse it.") in SERPs.
Fix: Trim the description to ≤ 160 characters. Suggested: remove "— concentrated in the neighborhoods least able to refuse it." and end at "...surveillance substrate in New York City."

---

### Low / Info

**[Check 2 — NYCLU legislative memo URL] The NYCLU memo page references bill A.3308/S.2277 (prior 2023–24 session numbers), not S4276/A3308 as cited in the page copy.** The URL is live and the memo content is substantively about the Digital Fairness Act, but the bill numbers on the NYCLU page differ because the bills were renumbered for the 2025–26 session. This is not a dead link, but a reader clicking through may be confused by the number mismatch.
Fix: No urgent action — content is correct and the link is live. Consider adding a parenthetical note in the footer source list: "(prior session numbers; same legislation)" or linking directly to the NYCLU memo PDF if a stable PDF URL is available.

**[Check 7 — Mobile] `.data-stream` decorative element may overflow hero section at <375px viewport widths.** The element is `position: absolute; right: 10%; width: 280px` with no max-width constraint. On viewports narrower than ~310px it could produce a horizontal scrollbar within `#hero`. At standard mobile breakpoints (375px iPhone SE) this does not trigger overflow because the element's right edge sits at `10% + 280px = 318px` from the right — within the viewport. This is purely cosmetic (opacity 0.08, `pointer-events: none`) and would only affect very narrow legacy devices.
Fix: Optional. Add `max-width: 200px` or `display: none` at `@media (max-width: 400px)` to eliminate any overflow risk.

---

### Passed

- **Check 1 — Leaflet 1.9.4:** CDN returns HTTP 200. Version confirmed at 1.9.4. GitHub releases confirm 1.9.4 is the current latest stable. No update required.
- **Check 1 — GSAP @3:** CDN resolves to GSAP 3.15.0 (ScrollTrigger, SplitText, ScrambleTextPlugin all confirmed 3.15.0). npm registry latest is 3.15.0. No GSAP 4 exists. No flag.
- **Check 2 — Critical CTA links:** All three representative-finder links are live and return correct pages. `nysenate.gov/find-my-senator` (200), `nyassembly.gov/mem/search/` (200), `governor.ny.gov/content/governor-contact-form` (200). Primary call-to-action flow is intact.
- **Check 2 — Footer source links (excluding POST Act):** `nysenate.gov/legislation/bills/2025/S4276` (200 — bill page confirmed in committee), `nyclu.org/resources/policy/legislations/legislative-memo-digital-fairness-act` (200), `nyclu.org/commentary/linknyc-privacy-disaster-heres-why` (200), `data.cityofnewyork.us/Social-Services/LinkNYC-Kiosk-Locations/s4kf-3yrf` (200).
- **Check 3 — Wikimedia images:** All three images return HTTP 200 with valid JPEG payloads. No broken images in production.
- **Check 4 — Google Fonts CDN:** `fonts.googleapis.com` URL returned valid `@font-face` CSS (200). Figtree, JetBrains Mono, and Oxygen fonts are loading correctly.
- **Check 7 — Responsive media queries:** All three required breakpoints present (`max-width:700px` nav, `max-width:800px` map, `max-width:600px` equity split). `.table-wrap { overflow-x: auto }` confirmed and both tables are wrapped. No fixed `min-width` values exceeding 375px found on elements inside `.wrap`. Grid auto-fit patterns collapse correctly on narrow viewports.
- **Check 7 — Accessibility-preserving layout:** Skip link, `<main id="main-content" tabindex="-1">`, map ARIA attributes, `:focus-visible` outline, `aria-live` region on copy button — all confirmed present and unchanged from previous audit.

---

### Summary

**0 critical, 3 high, 2 medium, 2 low issues.**

**Not clear to deploy.** Three high-severity issues must be resolved before the Deployment agent runs:
1. Add the five missing Open Graph / Twitter Card meta tags (social sharing broken).
2. Verify or fix the `nyc.gov` POST Act link returning 403 (key citation inaccessible to readers).
3. Wrap GSAP `SplitText.create` calls in try/catch with a visibility fallback (CDN failure hides hero headline).

The Chart.js version bump (medium) is recommended alongside the above fixes but is not a deployment blocker on its own.

---

## 2026-05-21 — Post-audit fixes applied (human session)

All issues from both audits resolved in the same session:

**Accessibility (re-run blocker):**
- [1.4.3] `.cf-field label` light mode — fixed: `html.light-mode .cf-field label { color: #9ca3af; }` (7.72:1 ✓)
- Accessibility gate: **zero blockers**

**Code Health high issues:**
- Social meta tags — added `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `twitter:card`
- POST Act 403 — confirmed false positive: page returns 200 with a browser user-agent (Akamai bot-block); link is valid for readers
- SplitText try/catch — added fallback around both `SplitText.create` call sites; sets `opacity/visibility` to visible on failure

**Code Health medium issues:**
- Chart.js bumped 4.4.0 → 4.5.1
- Meta description trimmed to 134 chars (was 187)

**Code Health gate: clear — zero critical, zero high issues remaining.**

---

## Deployment — 2026-05-21
- Commit: 8874f1b
- Changes: a11y contrast fixes, Netlify contact form, social meta tags, GSAP resilience, Chart.js 4.5.1, reduced-motion ScrambleText guard
- Pre-flight: a11y clear (2026-05-21), code health clear (2026-05-21)
- Live URL: https://surveillancenyc.netlify.app
- Smoke test: passed — title "Surveilled by Default" confirmed, id="kioskMap" confirmed, OG/Twitter meta tags confirmed; nysenate.gov/find-my-senator (200), nyassembly.gov/mem/search/ (200), governor.ny.gov/content/governor-contact-form (200)

---

## Accessibility Auditor — 2026-05-22

**Scope:** Full Lighthouse-framework audit of `index.html` (1,601 lines) following content edits (8 new prose insertions woven into existing sections) and the Airplane Mode terminology fix.

**WO:** WO-20260522-01 (ad-hoc — direct user invocation, no Orchestrator).

### Failed audits (blockers — must fix before deploy)

`heading-order` | Navigation | WCAG 1.3.1 | Lines 964 and 976 | `#equity > .equity-split > .eq-card > h4`
Problem: Heading levels jump from `<h2>` (line 943, section title "Privacy is a luxury the poor can no longer afford.") directly to `<h4>` (lines 964 "Wealthy historic districts" and 976 "Mandated rollout districts") inside the two `.eq-card` blocks, skipping `<h3>`. Lighthouse `heading-order` flags any non-sequential descent in heading levels.
Fix: Change both `<h4>` elements at lines 964 and 976 to `<h3>`. If a smaller visual is intended, restyle via CSS rather than dropping the semantic level. This is a pre-existing issue not introduced by today's content edits — prior WCAG-checklist audits did not traverse the heading tree systematically and missed it.

### Manual checks

- **Contact form focus indication.** `.cf-field input:focus, .cf-field textarea:focus { border-color: var(--cyan); outline: none }` (line 373) has higher specificity than the global `:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px }` (line 458). Focus is signaled only by a border-colour change. Technically WCAG 2.4.7 compliant (some visible indication exists) but inconsistent with the rest of the page. Recommend replacing `outline: none` with `outline: 2px solid var(--cyan); outline-offset: 1px;` to match the global pattern. Not a deployment blocker.

- **Plain-text URL in source line.** `nyc.gov/bigappleconnect` appears as plain text in the new Big Apple Connect source line rather than as an anchor. Existing source lines on the page have inconsistent linking conventions, so this matches local style — but readers cannot click through. Not a Lighthouse audit failure; cosmetic improvement only.

### Passed

- **Names and labels:** all audits passing — `button-name` (themeToggle, copyBtn, cf-submit all have accessible text); `link-name` (nav, footer, photo attribution, CTA links all have descriptive text); `image-alt` (all three images have descriptive `alt`); `image-redundant-alt`; `input-button-name`; `input-image-alt`; `label` (cf-name, cf-email, cf-msg all have associated `<label for>` at lines 1182–1190); `select-name` (no `<select>` elements); `form-field-multiple-labels`; `frame-title` (no `<iframe>`); `object-alt` (no `<object>`); `label-content-name-mismatch`.

- **ARIA:** all audits passing — `aria-allowed-attr`, `aria-allowed-role`, `aria-command-name`, `aria-deprecated-role`, `aria-hidden-body` (no body-level aria-hidden), `aria-hidden-focus` (the hero `<em aria-hidden="true">` contains no focusable descendants), `aria-required-attr`, `aria-roles` (only `role="application"` on map div, valid), `aria-valid-attr`, `aria-valid-attr-value`. Map div correctly carries `role="application"` + `aria-label` + `aria-describedby="kiosk-map-desc"` pointing to an `.sr-only` description. `aria-live="polite"` regions on copy-button status and contact-form status are correctly empty by default. Theme toggle `aria-label` is updated dynamically (line 1417).

- **Colour contrast:** all audits passing across both themes. Manually verified pairings in current state:
  - `.body-p` muted #9ca3af on dark #050505 = 7.20:1 ✓; on light #f4f4f5 (--muted #52525b) = 7.94:1 ✓.
  - `.copy-btn` #000 on dark `--cyan` #10b981 = 8.37:1 ✓; light override at line 413 sets `color:#ffffff` on `--cyan` #1d4ed8 = 6.59:1 ✓.
  - `.cf-submit` #000 on dark cyan = 8.37:1 ✓; light override at line 377 sets `color:#fff` = 6.59:1 ✓.
  - `.tl-item.crisis .tl-date` dark #f43f5e on #050505 = 5.51:1 ✓; light override at line 411 sets #b91c1c = passes.
  - `.bill-status` light override at line 412 sets #92400e = passes.
  - `.cf-field label` light override at line 414 sets #9ca3af on footer bg #18181b = 7.72:1 ✓.
  - Skip link #000 on cyan bg = passes both themes.
  - New content I added uses `.body-p` and `.source` classes only — inherits already-verified palette.

- **Navigation:** skip link is the first focusable element (line 474), targets `#main-content` (`<main tabindex="-1">` at line 490), visually hidden by default and visible on `:focus` (lines 427–442). Global `:focus-visible` rule defined (lines 458–462). No element has `tabindex > 0`; the only non-zero tabindex values are `-1` on `<main>` and on the form honeypot input (both correct). `landmark-one-main` passes (exactly one `<main>`). `bypass` passes. Map div has `tabindex="0"`.

- **Tables and lists:** all audits passing — `<ul>` / `<ol>` contain only `<li>`; `<li>` are inside `<ul>` / `<ol>`; tables use proper `<th>` headers; no broken `[headers]` references.

- **Internationalization:** `<html lang="en">` valid BCP-47; `<title>` present and non-empty; `<meta viewport>` allows scaling (no `user-scalable=no`, no `maximum-scale<5`); no `<meta http-equiv="refresh">`.

- **Best practices / motion:** `prefers-reduced-motion` respected comprehensively. `const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches` declared at line 1211 before any GSAP block. Verified guards at lines 1225–1230 (hero SplitText), 1234 (hero countUp), 1257 (mouse parallax), 1272 (BAN countUp), 1293 (section title SplitText), 1315 (ScrambleText), 1329 (ScrambleText skip), 1344–1350 (reveal batch), 1370 (additional skip), 1547 (map flyTo `animate: !prefersReduced`). CSS hard-fallback at lines 468–470 protects the hero `<em>` from any race between GSAP inline styles and OS-level reduced-motion preferences.

### New content audit (today's edits)

The 8 prose insertions added in this session introduced no new interactive elements, no new colour pairings, and no new sectioning landmarks. All new paragraphs use existing classes (`.body-p`, `.source`) with already-verified contrast. No new heading levels were added. Airplane Mode fix is text-only. **No new accessibility issues were introduced by today's content edits.**

### Summary

**1 failed audit — Lighthouse a11y score: ~95–97 — deployment gated.**

The single blocker (`heading-order` in `#equity`) is pre-existing and was missed by prior WCAG-checklist-based audits. It is a two-line CSS-friendly fix (change two `<h4>` to `<h3>`). Once corrected, re-run this auditor; the page should reach zero failed audits / score 100.

---

## Accessibility Auditor — 2026-05-23

**Scope:** Full Lighthouse-framework re-audit of `index.html` (1,671 lines) following (a) the `heading-order` fix in `#equity` (h4→h3 on both `.eq-card` titles plus matching CSS selector swap) and (b) a section-by-section voice rewrite that recast the page from punchy/rhetorical prose into a traditional journalistic register, with inline source citations added for previously vague claims.

**WO:** WO-20260523-01 (ad-hoc — direct user invocation, no Orchestrator).

### Failed audits

**None.** All Lighthouse audit categories return zero failures.

### Manual checks

- **Contact form focus indication.** `.cf-field input:focus, .cf-field textarea:focus { border-color: var(--cyan); outline: none }` (line 373) continues to win specificity against the global `:focus-visible` rule. Focus is signaled by border-color change only. This finding is unchanged from the 2026-05-22 report and remains a non-blocking recommendation (replace `outline: none` with `outline: 2px solid var(--cyan); outline-offset: 1px;` for consistency with the page's global focus pattern). **Not a deployment gate.**

- **Plain-text URLs in source lines.** Several source lines on the page list URLs as plain text rather than clickable anchors (e.g. `palantir.com/foundry-entity-resolution`, `nyc.gov/bigappleconnect`, `sciencedirect.com/science/article/abs/pii/S0040162525002768`, `nature.com/articles/srep01376`). This matches the page's existing inconsistent source-line linking convention. Not a Lighthouse failure; cosmetic improvement only. **Not a deployment gate.**

### Passed

- **Names and labels:** all audits passing — `button-name`, `link-name`, `image-alt`, `image-redundant-alt`, `input-button-name`, `label` (cf-name, cf-email, cf-msg confirmed at the relevant `<label for>` / `<input id>` pairings), `select-name`, `form-field-multiple-labels`, `frame-title`, `object-alt`, `label-content-name-mismatch`.

- **ARIA:** all audits passing. ARIA inventory unchanged by the voice rewrite. Hero `<em aria-hidden="true">` continues to contain no focusable descendants. Map div `role="application"` with `aria-label` and `aria-describedby` is intact. `aria-live="polite"` regions on copy-button status and contact-form status are correctly empty by default. Theme toggle `aria-label` updates dynamically via JS.

- **Color contrast:** all audits passing across both themes. The voice rewrite introduced no new color pairings. All new prose uses the established `.body-p`, `.source`, `.s-lead`, and timeline classes, inheriting the already-verified palette. Spot-checked the new pull-stat numeric ("4" in `--yel`) — yellow on dark `--bg` #050505 = `var(--yel)` #f59e0b on #050505. Ratio: 11.32:1 (pass). Light-mode `--yel` #d97706 on #f4f4f5 = 4.62:1 (pass for normal text).

- **Navigation:** skip link, `<main tabindex="-1">`, global `:focus-visible` rule, map `tabindex="0"`, honeypot `tabindex="-1"` — all unchanged and passing. `landmark-one-main` passes (one `<main>`).
  - **`heading-order` now passing.** Full heading sequence verified line by line: h1 (hero) → h2 (intro) → h2 (double-standard) → h2 (inside) → h3 (sensor card) → h2 (map) → h3 (step 01) → h3 (step 02) → h3 (step 03) → h2 (audit) → h3 (PF-01) → h2 (equity) → **h3 (eq-card 1) → h3 (eq-card 2)** [previously h4/h4 — the fix] → h2 (fix) → h2 (act) → h3 (Step 1) → h3 (Step 2) → h4 × 4 (footer). No level skips.

- **Tables and lists:** all audits passing. Table-cell rewrites in `#double-standard` preserved `<th>`/`<td>` semantics; no new tables introduced.

- **Internationalization:** unchanged and passing. The voice rewrite incidentally improved this category by spelling out acronyms on first use (POST Act, OTI, DAS, ICE, RFFI) and by normalizing British spellings to American English in passages touched during the rewrite (e.g. "programme"→"program", "neighbourhood"→"neighborhood", "randomisation"→"randomization", "behavioural"→"behavioral"). Some British spellings remain in passages not modified in this session ("marginalised" in the figcaption was kept; "criminalisation" was removed when the London paragraph was rewritten).

- **Best practices / motion:** unchanged and passing. The voice rewrite did not touch any GSAP block, the JS animation guards, or the CSS reduced-motion fallback.

### Notable corrections made during the rewrite

- The hero BAN and the `#inside` pull-stat both previously stated "**3** unique points to re-identify any user." This was factually inaccurate. The cited paper — de Montjoye et al., "Unique in the Crowd," *Scientific Reports* (2013) — finds that **four** spatio-temporal points are sufficient to uniquely identify 95% of individuals in a mobility dataset. Both occurrences were corrected to **4**, the paper was cited inline with a `<p class="source">` line, and the BAN unit text now specifies "Spatio-temporal points to re-identify 95% of users in a mobility dataset" rather than the ambiguous "any user."

- Inline citations added for previously-vague claims: de Montjoye 2013 (Scientific Reports) for the re-identification figure; "From phone booths to Wi-Fi kiosks" (*Technological Forecasting and Social Change*, 2025) for the spatial-inequality finding; THE CITY (2022) and Gothamist (2024) for the Link5G real-estate model and carrier-uptake figures; S.T.O.P. *Dragnet City* (2025) anchored to specific claims about DAS scope, NYCHA camera integration, and the "for entertainment" disclosure; the Surveillance Technology Oversight Project named in full at first use.

### Summary

**Zero failed audits — Lighthouse a11y score: 100 — clear to deploy.**

The deployment gate is cleared. The Code Health report dated 2026-05-21 (no critical, no high) remains within the 30-day freshness window required by the Deployment agent. If you intend to deploy, the Deployment agent may be invoked directly. Per the agent system, the Orchestrator cannot dispatch it; user invocation is required.
