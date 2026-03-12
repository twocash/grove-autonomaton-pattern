# Claude Code Prompt: Push grove-autonomaton-pattern to GitHub

## Context
The local repo `grove-autonomaton-pattern` has one commit that needs to be pushed to GitHub. This is the "foundry-v1.1-upgrade" commit from March 11.

## Current State
- Local HEAD: `928ebb1` "foundry-v1.1-upgrade"
- Remote likely behind by 1 commit

## Task
Push the local changes to GitHub origin/main.

## Commands
```bash
cd C:\GitHub\grove-autonomaton-pattern
git status
git push origin main
```

## Verify
After push, confirm with:
```bash
git log --oneline -3 origin/main
```

Should show `928ebb1 foundry-v1.1-upgrade` at HEAD.

## What Changed in This Commit
- `docs/recipes/foundry-template-v1/FIELD_TEST_FEEDBACK.md` (+36 lines)
- `docs/sprints/signal-watch-publication-v1/SPEC.md` (+383 lines)
- `src/config/prompts.schema.ts` (+131 lines net)

## Next Step After Push
This repo will be connected to Vercel for auto-deployment. See `MIGRATION-COMPLETE.md` in the monorepo for full instructions.
