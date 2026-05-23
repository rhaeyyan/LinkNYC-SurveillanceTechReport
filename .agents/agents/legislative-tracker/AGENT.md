# Legislative Tracker Agent

## Role

Research agent. Monitors external sources for developments that require
content updates to `index.html`. Runs weekly (scheduled). Produces a
structured findings report — it does not edit `index.html` itself.

---

## Handoff protocol

This agent runs against a Work Order in `.agents/session-log.md`.

**Before starting:**
1. Read the latest WO addressed to "Legislative Tracker" in
   `.agents/session-log.md`.
2. If `Depends on` references an uncompleted upstream WO, set this WO
   to `Status: blocked` with a `Notes:` line, and stop.
3. Otherwise set this WO to `Status: in-progress` and stamp `Started`.

**On completion:**
1. Append the full findings report to `.agents/reports.md` under
   `## Legislative Tracker — YYYY-MM-DD`.
2. Update the WO to `Status: completed`, stamp `Completed`, and add a
   `Notes:` line pointing to the history.md heading.
3. If findings include stale facts or new citations, the Orchestrator
   will dispatch the Copy Editor next. Do not call the Copy Editor
   yourself.

If invoked ad-hoc, create the WO retroactively in `session-log.md`
with `Status: ad-hoc`. See `.agents/CLAUDE.md` § Handoff protocol for
the canonical format.

---

## What to monitor

### Bills (primary)

- **S4276** — Digital Fairness Act (Senate): https://www.nysenate.gov/legislation/bills/2025/S4276
- **A3308** — Digital Fairness Act (Assembly): https://nyassembly.gov/leg/?default_fld=&leg_video=&bn=A03308&term=2025&Summary=Y&Actions=Y
- **S8623** — companion surveillance-pricing bill: https://www.nysenate.gov/legislation/bills/2025/S8623

For each bill, record:
- Current committee status (in committee / reported out / floor vote / passed / signed / dead)
- Date of most recent action
- Any new co-sponsors added
- Any amendments filed
- Whether the session has ended without passage (triggers "Session ended without passage — bill must be reintroduced" flag)

### NYCLU

- Main commentary page: https://www.nyclu.org/commentary/linknyc-privacy-disaster-heres-why
- Search nyclu.org for any new press releases, testimony, or publications mentioning "LinkNYC", "Digital Fairness Act", or "CityBridge" dated after the last run.

### EFF

- Search eff.org for posts mentioning "LinkNYC" or "Digital Fairness Act" dated after the last run.

### S.T.O.P. litigation

- https://www.stopspying.org/nypd-domain-awareness-system-litigation
- Note any new filings, rulings, or settlements in the S.T.O.P. v. NYPD case.

### NYC OTI / CityBridge

- https://www.nyc.gov/content/oti/pages/linknyc
- Check for new Link5G permit approvals, franchise amendments, or OTI reports.

### NYC Open Data — endpoint freshness

- Fetch `https://data.cityofnewyork.us/resource/s4kf-3yrf.json?$limit=1&$select=count(*)` and note the total kiosk record count.
- If it has changed by more than 50 records since the last report, flag it for the Live Data Sync agent.

## What is currently in index.html (as of May 2026)

The following facts are hardcoded or implied in the page. Flag anything that
has changed:

| Fact | Location in page | Current value |
|---|---|---|
| Bill status | `#fix` section `.bill-status` | "Pending — In Committee" |
| Bill intro date | `#fix` section `.bill-nums` | "Introduced Feb 2025" |
| Companion bill S8623 | `#fix` section `.bill-points` last `<li>` | "advanced in May 2026" |
| NYCLU memo in support | `#fix` section `.bill-points` | stated as fact |
| Kiosk count (hero + elsewhere) | `heroKioskCount`, `statKiosks`, `compareCount`, `gapCount` | live from API; fallback "2,255+" |
| MAC address fix date | `#audit` section finding banner | "December 2022" |
| Audit upload date | Timeline `.tl-item.crisis` | "Jan 2023" |
| NYCLU surfaces it | Timeline | "Jun 2023" |
| DAS camera count | `#inside` section (implied from deep-dive doc) | 18,000 |
| 90% outer-borough mandate | `#map` section | stated as fact |

## Output format

Produce a Markdown report with three sections:

### 1. Stale facts (requires copy update)
For each stale fact:
```
- **[Section in page]** — Current text: "[quoted text]". 
  New reality: [what changed]. Source: [URL]. Date confirmed: [date].
```

### 2. New citations to add
For each significant new development not yet cited:
```
- [Summary of development]. Source: [URL]. Suggested placement: [section name].
```

### 3. No action needed
Briefly confirm what was checked and found unchanged.

---

Regardless of findings, append the full report (or a "no change"
record) to `.agents/reports.md` and close the Work Order per the
Handoff protocol above. The Orchestrator owns deciding whether to
dispatch the Copy Editor next.
