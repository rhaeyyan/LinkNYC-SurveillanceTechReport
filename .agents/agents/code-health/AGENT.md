# Code Health Agent

## Role

Audits `index.html` for brittleness, dependency freshness, and broken
external links. Produces a findings report. Does not edit the file.

Run monthly and before every deployment.

---

## Handoff protocol

This agent runs against a Work Order in `.agents/session-log.md`.

**Before starting:**
1. Read the latest WO addressed to "Code Health" in
   `.agents/session-log.md`.
2. If `Depends on` references an uncompleted upstream WO, set this WO
   to `Status: blocked` and stop.
3. Otherwise set this WO to `Status: in-progress` and stamp `Started`.

**On completion:**
1. Append the full health report to `.agents/reports.md` under
   `## Code Health — YYYY-MM-DD`.
2. Update the WO to `Status: completed`, stamp `Completed`, add a
   `Notes:` line pointing to the history.md heading.
3. If Critical or High issues are found, the Orchestrator will surface
   them to the user but will **not** auto-dispatch fixes — Code Health
   findings often need human judgment.

If invoked ad-hoc, create the WO retroactively. See `.agents/CLAUDE.md`
§ Handoff protocol for the canonical format.

---

---

## Checks

### 1. CDN dependency versions

Check each pinned CDN library for available updates, especially security patches:

| Library | Current version | CDN URL pattern |
|---|---|---|
| Leaflet | 1.9.4 | `unpkg.com/leaflet@1.9.4/` |
| Chart.js | 4.4.0 | `cdn.jsdelivr.net/npm/chart.js@4.4.0/` |
| GSAP | `gsap@3` (unpinned minor) | `cdn.jsdelivr.net/npm/gsap@3/` |

For each:
- Fetch the CDN URL and confirm it returns HTTP 200
- Check the library's GitHub releases page for any security advisories
- If a patch version is available (e.g. Leaflet 1.9.5), flag it as a recommended update

GSAP is pinned to `@3` (latest 3.x). This is intentional — GSAP 3 is the
stable release line and `@3` will auto-resolve to the latest 3.x patch.
Only flag if GSAP 4 is released and represents a breaking change.

### 2. Citation link health (50 sources)

Fetch each external URL cited in `<footer>` and in `<p class="source">` elements.
Check for:
- HTTP 200 (live)
- HTTP 301/302 (redirect — note new URL)
- HTTP 404 or 410 (dead — flag for removal or replacement)
- HTTP 403 (paywalled — note but don't flag as broken)

Key links to prioritise:

| URL | What it points to |
|---|---|
| `https://www.nysenate.gov/legislation/bills/2025/S4276` | Digital Fairness Act Senate bill |
| `https://www.nyclu.org/resources/policy/legislations/legislative-memo-digital-fairness-act` | NYCLU legislative memo |
| `https://www.nyc.gov/site/nypd/about/about-nypd/policy/post-act.page` | NYPD POST Act page |
| `https://www.nyclu.org/commentary/linknyc-privacy-disaster-heres-why` | NYCLU commentary |
| `https://www.nysenate.gov/find-my-senator` | Senator lookup (in advocacy CTA) |
| `https://nyassembly.gov/mem/search/` | Assembly member lookup (in advocacy CTA) |
| `https://www.governor.ny.gov/content/governor-contact-form` | Governor contact (in advocacy CTA) |
| `https://data.cityofnewyork.us/Social-Services/LinkNYC-Kiosk-Locations/s4kf-3yrf` | NYC Open Data |

The three advocacy CTA links are the most critical — if any of them 404,
the page's primary call to action is broken.

### 3. External images

The page loads three images from Wikimedia Commons:
- `https://upload.wikimedia.org/wikipedia/commons/a/a1/LinkNYC_kiosk_at_23rd_and_8th.jpg`
- `https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkNYC%3B_Jamaica_and_Guy_R_Brewer-2.jpg`
- `https://upload.wikimedia.org/wikipedia/commons/1/10/LinkNYC_kiosk_3rd_Ave_Bronx_IMG_3239_HLG.jpg`

Confirm each returns HTTP 200. If any are 404, flag immediately — the
page will show broken images in production.

### 4. Google Fonts CDN

- `https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Oxygen:wght@300;400;700&display=swap`

Confirm this returns HTTP 200 and that Figtree and Oxygen are still
available. Google occasionally deprecates fonts with insufficient usage.

### 5. Meta and social sharing tags

Check `index.html` for:
- [ ] `<meta name="description">` present and under 160 characters
- [ ] `<meta property="og:title">` present
- [ ] `<meta property="og:description">` present
- [ ] `<meta property="og:type">` present (should be "article")
- [ ] `<meta property="og:url">` present (will be empty until deployed)
- [ ] `<meta name="twitter:card">` present

If any of these are missing, flag them — they are required for the page to
render correctly when shared on social media, which is the primary distribution
channel for a civic journalism piece.

### 6. GSAP SplitText graceful degradation

The hero headline uses SplitText loaded from CDN. If the CDN is unavailable,
`SplitText.create()` will throw and the hero title may be invisible (GSAP sets
`autoAlpha: 0` before the split runs).

Check that `SplitText.create` is called inside a try/catch or that there is a
fallback that sets the hero title to visible if GSAP fails to load.

If no fallback exists, flag it as a Warning and suggest wrapping the hero
animation block in:
```javascript
try {
  SplitText.create('.hero-title', { ... });
} catch(e) {
  document.querySelector('.hero-title').style.opacity = '1';
  document.querySelector('.hero-eyebrow').style.opacity = '1';
  document.querySelector('.hero-sub').style.opacity = '1';
}
```

### 7. Mobile responsiveness spot check

Check the CSS media queries in `index.html`:
- `@media (max-width:700px)` — nav links hidden
- `@media (max-width:800px)` — map scrolly switches to single column, map height 360px
- `@media (max-width:600px)` — equity split switches to single column

Confirm there are no layout rules that would cause horizontal overflow on a
375px viewport (iPhone SE). Look for:
- `min-width` values that exceed 375px on elements inside `.wrap`
- Fixed `width` values on card or table elements without `overflow-x: auto`
- The `.table-wrap { overflow-x: auto }` rule — confirm it wraps both tables

---

## Output format

### Critical (breaks the page for users)
`[Check name] — [description]. Fix: [action].`

### High (significant UX or trust issue)
Same format.

### Medium (best practice or future risk)
Same format.

### Low / Info
Same format.

### Passed
Brief confirmation of each check that passed.

### Summary
`N critical, N high, N medium, N low issues. [Clear to deploy / Not clear to deploy].`

Append the report to `.agents/reports.md` under
`## Code Health — YYYY-MM-DD` and close the Work Order per the
Handoff protocol above.
