/**
 * Zone Schema — Sovereignty Guardrails
 *
 * The three zones define the governance model:
 * - GREEN: System executes autonomously
 * - YELLOW: System proposes, human approves
 * - RED: Human-only, system surfaces information
 *
 * This is what makes the Autonomaton pattern different from "AI that does things."
 * The zones are the guardrails. The human stays in control.
 */

import type { ZonesSchema } from '../state/types'

export const defaultZonesSchema: ZonesSchema = {
  zones: {
    green: {
      meaning: 'Autonomous Routine',
      flywheel_eligible: true,
      allows: [
        'execute_confirmed_skills',
        'write_telemetry',
        'update_pattern_counts',
      ],
      description: 'System executes without asking. Confirmed patterns, low-risk operations.',
    },

    yellow: {
      meaning: 'Supervised Proposals',
      flywheel_eligible: true,
      allows: [
        'propose_new_skill',
        'propose_rule_change',
        'draft_content',
        'analyze_data',
      ],
      description: 'System proposes, human approves. Medium-risk operations.',
    },

    red: {
      meaning: 'Human-Only',
      flywheel_eligible: false,  // Governance lock: destructive ops cannot become skills
      allows: [
        'surface_information_only',
      ],
      description: 'System surfaces info and waits. Architecture decisions, security changes, destructive operations.',
    },
  },
}

/**
 * Serialize zones schema to YAML-like string for display
 */
export function serializeZonesSchema(schema: ZonesSchema): string {
  let yaml = `# ZONES SCHEMA — Human-Readable Governance
#
# This file defines the sovereignty guardrails:
#   GREEN  → System executes autonomously
#   YELLOW → System proposes, human approves
#   RED    → Human-only, system surfaces info
#
# Zones are extensible. Add new zones, redefine
# what actions each zone allows, change the
# governance model to fit your domain.
#
# This file is READ-ONLY in this demo to preserve
# the core pattern. In production, it's just config.

zones:
`

  for (const [name, zone] of Object.entries(schema.zones)) {
    yaml += `  ${name}:\n`
    yaml += `    meaning: "${zone.meaning}"\n`
    yaml += `    flywheel_eligible: ${zone.flywheel_eligible}\n`
    yaml += `    description: "${zone.description}"\n`
    yaml += `    allows:\n`
    for (const action of zone.allows) {
      yaml += `      - ${action}\n`
    }
  }

  return yaml
}

/**
 * Get zone color class for consistent styling
 */
export function getZoneColorClass(zone: 'green' | 'yellow' | 'red'): string {
  return `zone-${zone}`
}

/**
 * Get zone description for UI display
 */
export function getZoneLabel(zone: 'green' | 'yellow' | 'red'): string {
  const labels = {
    green: 'Autonomous',
    yellow: 'Supervised',
    red: 'Human-Only',
  }
  return labels[zone]
}
