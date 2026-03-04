/**
 * skills.library — Approved Pattern Cache
 *
 * Read-only view of approved skills.
 * Skills are created through the Skill Flywheel when patterns repeat 3+ times.
 */

import type { Skill } from '../state/types'

export function serializeSkills(skills: Skill[]): string {
  if (skills.length === 0) {
    return `# skills.library
# Approved patterns that execute at Tier 0 (local, free).
#
# Skills are created automatically:
# 1. Repeat an action 3+ times
# 2. System proposes skill extraction
# 3. You approve → pattern cached here
#
# No skills approved yet.
# Try repeating "capture my idea about X" three times!
`
  }

  const skillEntries = skills.map(skill => `
  - id: ${skill.id}
    pattern: "${skill.pattern}"
    intent: ${skill.intentMatch}
    original_tier: ${skill.originalTier}
    times_fired: ${skill.timesFired}
    savings: $${skill.cumulativeSavings.toFixed(4)}
    approved_at: ${skill.approvedAt}`).join('\n')

  return `# skills.library
# Approved patterns that execute at Tier 0 (local, free).
# These skills bypass cloud inference entirely.

skills:${skillEntries}

# ---
# Total skills: ${skills.length}
# Combined savings: $${skills.reduce((sum, s) => sum + s.cumulativeSavings, 0).toFixed(4)}
`
}
