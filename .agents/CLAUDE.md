# LinkNYC Surveillance Tech Report — Project Guide

## What this project is

A single-file civic journalism and advocacy page about LinkNYC surveillance
and the pending New York State Digital Fairness Act (S4276 / A3308). The
target audience is the general NYC public, not developers or data
professionals. The primary call to action is for readers to contact their
State representatives to advance the bill out of committee.

The page is `index.html`. That is the entire deliverable.

## Key files

| File | Purpose |
|---|---|
| `index.html` | The deliverable — single self-contained HTML/CSS/JS page |
| `CLAUDE.md` | This file — loaded automatically in every Claude Code session |
| `.agents/reports.md` | Raw agent output — audit reports, findings, deployment records |
| `.agents/session-log.md` | Structured Work Order log — session continuity, handoff state |
| `.agents/agents/` | Agent prompt files — one subdirectory per maintenance agent |
| `.agents/skills/` | GSAP skill files (greensock/gsap-skills package) |

## Tech stack (index.html)

- Pure HTML/CSS/JS — no build step, no framework, no bundler
- Fonts: Figtree (headings) + Oxygen (body) via Google Fonts CDN
- Maps: Leaflet.js 1.9.4 + CARTO dark/light tiles; live data from NYC Open Data
- Charts: Chart.js 4.4.0
- Animations: GSAP via CDN — ScrollTrigger, SplitText, ScrambleText
- Two colour themes: Whistleblower Terminal (dark) / Editorial Print (light), toggled and persisted via localStorage

## The bill

- **Senate Bill S4276** + **Assembly Bill A3308** = Digital Fairness Act
- Introduced February 2025; in Committee on Internet & Technology as of May 2026
- Requires affirmative consent before personal data is collected
- Closes the POST Act loophole for private contractors like CityBridge
- NYCLU has published a formal legislative memo in support
- Companion bill S8623 (surveillance pricing) advanced in the NY Senate, May 2026

## NYC Open Data endpoints used

| Dataset | Endpoint | Used for |
|---|---|---|
| LinkNYC Kiosk Locations | `s4kf-3yrf` | Live kiosk count + map markers |
| LinkNYC Locations Live | `2gah-qsg7` | Activated-only count |
| LinkNYC Usage Statistics | `69wu-b929` | Historical usage data |

## Voice and copy rules

All prose in `index.html` follows a traditional journalistic voice that
prioritizes clarity over rhetorical compression. When editing or adding copy,
respect these constraints:

1. **Inverted pyramid.** Lead each section with its most important factual
   claim. The first sentence should be reportable in isolation, not a hook.
2. **Direct attribution.** Name sources at first mention ("According to the
   NYCLU,...", "A 2013 paper in *Scientific Reports* found that..."). Avoid
   ungrounded plural authorities ("researchers say", "critics argue").
3. **Complete sentences.** No fragment landings such as "They didn't." or
   "It's the architecture." Every clause is a full sentence.
4. **Neutral register.** Third-person reporting throughout. Do not address
   the reader in the second person. Distinguish reported facts from analysis;
   flag analysis explicitly ("This pattern suggests...", "Civil-liberties
   advocates including the NYCLU characterize this as...").
5. **Em-dashes for clarification only**, not for rhetorical asides. If a
   parenthetical does not add necessary information, cut it.
6. **Spell out acronyms** at first use ("Public Oversight of Surveillance
   Technology Act (POST Act)"). Define technical terms with a brief gloss on
   first reference.
7. **American English** throughout. Existing copy contains British spellings
   in places; when editing, normalize the surrounding passage to American
   English. Do not introduce new British-English forms.
8. **No new sections** without explicit approval. Edit existing copy only.

## Accessibility constraints

The page targets WCAG 2.1 AA compliance. Do not regress any of the following:

- Skip link at top of `<body>` pointing to `#main-content`
- All content wrapped in `<main id="main-content" tabindex="-1">`
- `role="application"` + `aria-label` + `aria-describedby` on the Leaflet map div
- `:focus-visible` outline (2px cyan) on all interactive elements
- `prefers-reduced-motion` respected in every GSAP animation block
- `aria-live="polite"` region on the copy-letter button

## Agent orchestration

Every multi-agent session goes through the **Orchestrator** agent. The
Orchestrator parses the user's instruction, dispatches Work Orders to the
right sub-agents, tracks status in `.agents/session-log.md`, and reports
back when the session ends. Sub-agents do not run themselves unless
invoked ad-hoc by the human.

| Agent | Prompt file | Role | Cadence | Depends on |
|---|---|---|---|---|
| **Orchestrator** | `.agents/agents/orchestrator/AGENT.md` | Plans, dispatches, tracks | Every session entry point | — |
| **Legislative Tracker** | `.agents/agents/legislative-tracker/AGENT.md` | Monitors bills, NYCLU, EFF, OTI | Weekly (scheduled) | Orchestrator WO |
| **Accessibility Auditor** | `.agents/agents/accessibility-auditor/AGENT.md` | Lighthouse-based a11y audit | After any HTML edit | Orchestrator WO |
| **Copy Editor** | `.agents/agents/copy-editor/AGENT.md` | Applies prose edits | On Tracker / Data Sync findings | Legislative Tracker or Live Data Sync WO |
| **Live Data Sync** | `.agents/agents/live-data-sync/AGENT.md` | Checks NYC Open Data endpoints | Monthly | Orchestrator WO |
| **Code Health** | `.agents/agents/code-health/AGENT.md` | CDN, link health, meta tags | Monthly / pre-deploy | Orchestrator WO |
| **Deployment** | `.agents/agents/deployment/AGENT.md` | Pushes to live host | **Human-invoked only** | Human approval |

### Hard rules

1. **The Orchestrator must never dispatch the Deployment agent.**
   Deployment is invoked by the human, runs its own pre-flight gate,
   then asks the human a final y/N before pushing.
2. **The Accessibility Auditor must report zero blockers** on the
   current state of `index.html` before any deployment.
3. **Code Health must report zero critical and zero high issues**
   within the last 30 days before any deployment.
4. **Every agent run is logged twice:** Work Orders → `.agents/session-log.md`
   (state + handoffs). Findings/reports → `.agents/reports.md` (content).
   Do not mix the two.

### Orchestration flow

```
                       USER INSTRUCTION
                              │
                              ▼
                       Orchestrator
                  ┌──── reads session-log.md ────┐
                  │   writes Work Orders         │
                  ▼                              │
       ┌──────────┴──────────┐                   │
       │                     │                   │
Legislative Tracker    Live Data Sync       Code Health
       │                     │                   │
       ▼                     ▼                   │
  Copy Editor ←──────────────┘                   │
       │                                         │
       └──────────────► Accessibility Auditor ◄──┘
                              │
                              ▼ (zero blockers)
                       SESSION COMPLETE
                              │
                              ▼ (human invokes Deployment)
                   Deployment pre-flight gate
                              │
                              ▼ (final y/N from human)
                          Live URL
```

## Handoff protocol

Every agent run is tracked as a **Work Order (WO)** in
`.agents/session-log.md`. The Orchestrator creates WOs; sub-agents
execute them and mark them complete. The actual content output of an
agent (audit report, findings, deployment record) still goes to
`.agents/reports.md`.

### WO format

```
### WO-YYYYMMDD-NN | [from] → [to]
- **Scope:** one sentence — what to do
- **Inputs:** files/data the agent needs (e.g. `index.html`, prior WO id)
- **Success criteria:** what "done" looks like, in observable terms
- **Deliverable:** where the output lands (usually `.agents/reports.md § [heading]`)
- **Depends on:** prior WO id, or "none"
- **Status:** dispatched | in-progress | completed | blocked | ad-hoc
- **Started:** YYYY-MM-DD HH:MM
- **Completed:** YYYY-MM-DD HH:MM or "—"
- **Notes:** optional one-liner (often a pointer to the history.md entry)
```

### Lifecycle

1. **Dispatch.** Orchestrator writes the WO with `Status: dispatched`
   and stamps `Started`.
2. **Pick up.** Sub-agent reads its WO. If `Depends on` references a WO
   that is not `completed`, set `Status: blocked`, write the reason in
   `Notes:`, and stop. Otherwise set `Status: in-progress`.
3. **Complete.** Append the full report to `.agents/reports.md` under a
   dated heading. Update the WO to `Status: completed`, stamp
   `Completed`, and add a `Notes:` line: `Report at history.md § [heading]`.
4. **Blocked.** Set `Status: blocked` with the reason in `Notes:`. Do
   not retry automatically.

### Ad-hoc runs

If the user invokes a sub-agent directly (no Orchestrator turn), the
sub-agent creates its WO retroactively in `session-log.md` with
`Status: ad-hoc` and proceeds. The Orchestrator picks these up on the
next session and folds them into the carryover.

### What never goes through this protocol

The **Deployment agent does not follow the WO lifecycle.** It is
human-invoked, runs its own pre-flight, and writes a deployment record
directly to `.agents/reports.md` after the push. There is no
Orchestrator-issued WO for deployment. Ever.
