# Grove Autonomaton v0.3 — "Training the System"

## Live Status

| Field | Value |
|-------|-------|
| **Current Phase** | Complete |
| **Status** | ✅ All tasks implemented |
| **Blocking Issues** | None |
| **Last Updated** | 2026-03-04T16:00:00Z |
| **Next Action** | Manual verification, then commit |
| **Attention Anchor** | Transform mental model from "chatting with AI" to "training a system" |

---

## Attention Anchor

**Re-read this block before every major decision.**

- **We are building:** UI feedback that makes the skill flywheel visible and interactive
- **Success looks like:** User sees "👀 Observed (1/3)", clicks Run Again twice, approves skill, sees button upgrade
- **We are NOT:** Adding new architectural features or changing core pipeline logic
- **Current phase:** Implementation
- **Next action:** Add patternCountAtCreation to Interaction type

---

## Goal

Transform the user's mental model from "chatting with an AI" to "training a system." Every interaction should feel like building muscle memory for the architecture.

---

## The 5 Improvements

1. **Persistent Prompt Tray** - Buttons stay visible above input
2. **Pattern Tracking Badge** - "👀 Observed (N/3)" on interaction cards
3. **Run Again Button** - 🔁 on completed cards
4. **Post-Approval Transformation** - Badges transform, tray buttons upgrade
5. **Editor Syntax Theme** - Semantic YAML highlighting

---

## Acceptance Criteria

- [x] Pattern badge shows "👀 Observed (1/3)" after first interaction
- [x] Run Again button fires the same interaction
- [x] Prompt tray visible at all times, above input
- [x] Approved skills transform badges to "⚡ Cached Skill"
- [x] Tray buttons upgrade when skill is approved
- [x] YAML editor shows colored syntax (cyan keys, purple numbers)
