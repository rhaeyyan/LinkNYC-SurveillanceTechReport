# Live Data Sync Agent

## Role

Checks the three NYC Open Data API endpoints against values hardcoded or
implied in `index.html`. Flags discrepancies. Does not edit the file —
produces a findings report for author review.

Run monthly, or whenever the Legislative Tracker flags a significant change
in the kiosk record count.

---

## Handoff protocol

This agent runs against a Work Order in `.agents/session-log.md`.

**Before starting:**
1. Read the latest WO addressed to "Live Data Sync" in
   `.agents/session-log.md`.
2. If `Depends on` references an uncompleted upstream WO, set this WO
   to `Status: blocked` and stop.
3. Otherwise set this WO to `Status: in-progress` and stamp `Started`.

**On completion:**
1. Append the full sync report to `.agents/reports.md` under
   `## Live Data Sync — YYYY-MM-DD`.
2. Update the WO to `Status: completed`, stamp `Completed`, add a
   `Notes:` line pointing to the history.md heading.
3. If counts have drifted enough that prose needs updating, the
   Orchestrator will dispatch the Copy Editor next. Do not edit
   `index.html` yourself.

If invoked ad-hoc, create the WO retroactively. See `.agents/CLAUDE.md`
§ Handoff protocol for the canonical format.

---

---

## Endpoints to check

### 1. Kiosk Locations — s4kf-3yrf

```
GET https://data.cityofnewyork.us/resource/s4kf-3yrf.json?$select=count(*)
```

This returns the total number of records (all kiosks: active, permitted,
payphones). Compare against:
- The fallback count "2,255+" displayed in the hero BANs and comparison table
  (the live JS fetches up to 5,000 records and displays the plotted count;
  the fallback is only shown if the API fails)
- Check how many records have `link_installation_status` = "Active" vs other statuses

Also fetch a sample to verify the response schema still matches what the JS
expects:
```
GET https://data.cityofnewyork.us/resource/s4kf-3yrf.json?$limit=5&$select=latitude,longitude,planned_kiosk_type,link_installation_status,link_site_id,street_address
```
Confirm all six fields are present and non-null for at least some records.

### 2. Locations Live — 2gah-qsg7

```
GET https://data.cityofnewyork.us/resource/2gah-qsg7.json?$select=count(*)
```

This returns activated (smoke-tested) kiosks. The page does not currently
display this count directly, but it is the more meaningful "active" figure
for advocacy claims. Flag if the count differs significantly from the
s4kf-3yrf active count.

### 3. Usage Statistics — 69wu-b929

```
GET https://data.cityofnewyork.us/resource/69wu-b929.json?$limit=1&$order=week_start_date DESC
```

Check the most recent week_start_date. If data hasn't been updated in more
than 90 days, flag it as stale (dataset may have been deprecated).

---

## What to flag

| Condition | Severity | Action |
|---|---|---|
| s4kf-3yrf record count changed by >100 since last report | High | Flag for Live Data update; note new count |
| s4kf-3yrf response schema missing expected fields | Critical | Flag immediately — JS map will break |
| s4kf-3yrf API returns non-200 status | Critical | Flag immediately |
| 2gah-qsg7 activated count differs from active s4kf-3yrf count by >500 | Medium | Note discrepancy for copy review |
| 69wu-b929 most recent record is >90 days old | Medium | Flag dataset as potentially deprecated |

---

## Updating index.html (if approved)

If the author approves a count update, the fallback text in these four
element IDs must be updated:

| Element ID | Current fallback value |
|---|---|
| `heroKioskCount` | "2,255+" |
| `statKiosks` | "2,255+" |
| `compareCount` | "2,255+" |
| `gapCount` | "2,255+" |

These are set live by the JS when the API call succeeds. The fallback text
is only visible if the API fails. Update the fallback to the new count only
if the actual live plotted count from the JS is consistently different.

Also check `#inside section .body-p` for any hardcoded kiosk count mentioned
in prose (e.g. "more than 2,000 active units"). Update if needed to match
the current active figure.

---

## Output format

```
## Live Data Sync Report — [date]

### s4kf-3yrf
- Record count: [N]
- Last checked: [date]
- Schema: [OK / ISSUES: list missing fields]
- Status: [OK / FLAG: description]

### 2gah-qsg7
- Activated count: [N]
- Status: [OK / FLAG: description]

### 69wu-b929
- Most recent week: [date]
- Status: [OK / STALE: last update was N days ago]

### Recommended changes to index.html
[List any copy or fallback updates needed, or "None."]
```

Append the report to `.agents/reports.md` under
`## Live Data Sync — YYYY-MM-DD` and close the Work Order per the
Handoff protocol above.
