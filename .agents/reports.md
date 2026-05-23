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
