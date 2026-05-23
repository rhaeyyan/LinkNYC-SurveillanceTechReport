# Session Log

Rolling, structured log of orchestrated sessions. The Orchestrator agent
reads the tail of this file at session start and appends a new session
block at session end. Sub-agents update their own Work Order entries
here as they pick them up and complete them.

For raw agent output (audit reports, findings, deployment records), see
`.agents/reports.md`. **This file tracks state and handoffs; that file
holds content.** Do not mix them.

See `.agents/CLAUDE.md` § Handoff protocol for the canonical Work Order
format and lifecycle rules.

---

## Open items carried across sessions

_None yet — initialise on first orchestrated session._

---

## Session template (copy this block for each new session)

```
## Session NNN — YYYY-MM-DD

**Triggered by:** [user instruction summary | scheduled cron | ad-hoc]
**Orchestrator turn:** [Claude model id | "human"]

### Intent
[1–2 sentences — what the user asked for, in plain English]

### Plan
1. WO-YYYYMMDD-01 — [agent] — [one-line scope]
2. WO-YYYYMMDD-02 — [agent] — [one-line scope]
3. ...

### Work orders

### WO-YYYYMMDD-01 | Orchestrator → [agent]
- **Scope:** ...
- **Inputs:** ...
- **Success criteria:** ...
- **Deliverable:** .agents/reports.md § [heading]
- **Depends on:** none
- **Status:** dispatched
- **Started:** YYYY-MM-DD HH:MM
- **Completed:** —
- **Notes:**

### Session summary
- **Completed:** [WO ids + one-line outcome each]
- **Open:** [WOs not yet picked up]
- **Blocked:** [WOs returned blocked, with reason]
- **Deployment status:** [gated | clear — awaiting human approval | deployed]
- **Carry to next session:** [items requiring follow-up]
```

---

## Sessions

<!-- Newest session block goes immediately below this line. -->
