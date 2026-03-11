# Manifesto Build Plan — Field Test Feedback

**Tester:** Jim Calhoun
**Date:** 2026-03-11
**Method:** Compiled Signal Watch template in Foundry, downloaded Manifesto + Recipe Bundle, dropped both into Claude Code, followed "Build Phase 1-4" instructions verbatim.

---

## Issue 1: Server Restart Not Mentioned After Phase 2
**Phase:** 2 (Intelligence Layer)
**Severity:** Documentation bug
**Problem:** New components added in Phase 2 require `npm run dev` restart. Claude Code doesn't know this, dev gets confused when new routes don't appear.
**Fix:** Add to Manifesto build plan Phase 2 checkpoint: "New components require server restart. Run `npm run dev` again after Phase 2 completes."

## Issue 2: Config UI / API Key Input Comes Too Late
**Phase:** 2 (Intelligence Layer) — but Config UI is scheduled for Phase 4
**Severity:** UX sequencing bug
**Problem:** Phase 2 enables the Cognitive Router and model dispatch, but there's no UI to enter API keys. The router is live with no way to configure it. Dev is stuck.
**Fix:** Either:
- **(A)** Move API key input / minimal Config view to Phase 2 (since that's when models become active)
- **(B)** Phase 1 includes a minimal Config panel with API key fields
- Recommendation: **(A)** — Phase 2 checkpoint should say "After wiring the router, add a Config panel with API key inputs for each tier. The router needs keys to dispatch."

## Issue 3: Phase Checkpoints Don't Surface What's Been Built
**Phase:** All phases
**Severity:** UX gap
**Problem:** Demo mode has pre-loaded content (demo briefings, demo signals, sample interactions) that's "super cool" but the dev doesn't know it's there. Each phase unlocks new functionality that should be demonstrated.
**Fix:** Phase checkpoints in the build plan should instruct Claude Code to show what was just unlocked. Example:
- Phase 1 checkpoint: "Start the dev server. You should see the pipeline visualization, zone indicators, and telemetry stream. Try the demo mode — pre-loaded interactions show the pipeline in action."
- Phase 2 checkpoint: "Restart the dev server. Enter an API key in the Config panel. Type 'brief me on Anthropic' in the command bar. Watch it route to Tier 2, Yellow Zone. Approve the result."
- Phase 3 checkpoint: "Run 5+ interactions with the same intent. The Flywheel should detect the pattern and propose a skill. Approve it. Watch it migrate to Tier 0."
- Phase 4 checkpoint: "All 6 views should be populated. Switch voice presets and re-run a scan — output style should change visibly."

---

## Pending — More feedback coming after Phases 3 and 4
