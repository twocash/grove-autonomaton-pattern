/**
 * Signal Watch Zone Schema — Competitive Intelligence Governance
 *
 * The three zones define the governance model based on:
 * - Score delta magnitude (how much competitive scores change)
 * - Signal threat level (routine, significant, critical)
 * - Special conditions (tier crossings, structural events)
 *
 * Zone Thresholds (per Sovereign Manifesto):
 * - GREEN: All deltas < 0.05, no signals above "routine"
 * - YELLOW: Any delta 0.05-0.15, or any "significant" signal
 * - RED: Any delta >= 0.15, "critical" signal, or tier crossing
 *
 * The zones are structural. RED zone operations cannot become skills.
 */

import type { ZonesSchema, SignalLevel } from '../state/types'

/**
 * Score delta thresholds for zone determination
 */
export const ZONE_THRESHOLDS = {
  greenMax: 0.05,    // Below this → GREEN zone
  yellowMax: 0.15,   // Below this (but >= greenMax) → YELLOW zone
  // >= yellowMax → RED zone
} as const

/**
 * Determine zone based on score delta and signal level
 */
export function determineZone(
  delta: number,
  signalLevel: SignalLevel,
  tierCrossing: boolean = false
): 'green' | 'yellow' | 'red' {
  // RED zone triggers (any one of these)
  if (Math.abs(delta) >= ZONE_THRESHOLDS.yellowMax) return 'red'
  if (signalLevel === 'critical') return 'red'
  if (tierCrossing) return 'red'

  // YELLOW zone triggers
  if (Math.abs(delta) >= ZONE_THRESHOLDS.greenMax) return 'yellow'
  if (signalLevel === 'significant') return 'yellow'

  // Default to GREEN
  return 'green'
}

export const defaultZonesSchema: ZonesSchema = {
  zones: {
    green: {
      meaning: 'Routine Monitoring',
      flywheel_eligible: true,
      thresholds: {
        maxScoreDelta: ZONE_THRESHOLDS.greenMax,
        signalLevel: 'routine',
      },
      allows: [
        'log_briefing',
        'update_telemetry',
        'archive_low_relevance',
        'fetch_rss',
        'apply_keyword_filters',
        'execute_skills',
        'classify_keyword_signals',
        'compile_routine_briefing',
        'quick_relevance',
      ],
      forbids: [
        'update_baseline_scores',
        'send_alerts',
        'recommend_strategic_actions',
      ],
      description: 'Routine monitoring with all score deltas < 0.05 and no significant signals. System executes autonomously.',
    },

    yellow: {
      meaning: 'Significant Shift',
      flywheel_eligible: true,
      thresholds: {
        minScoreDelta: ZONE_THRESHOLDS.greenMax,
        maxScoreDelta: ZONE_THRESHOLDS.yellowMax,
        signalLevel: 'significant',
      },
      allows: [
        'draft_briefing',
        'highlight_adjustments',
        'request_analysis',
        'classify_novel_signals',
        'multi_subject_correlation',
        'ad_hoc_scan',
        'analyze_score_shifting_events',
        'historical_patterns',
        'notify_operator',
      ],
      requiresApproval: [
        'update_baseline_scores',
        'promote_skill',
        'modify_source_reliability',
      ],
      description: 'Significant shift detected (delta 0.05-0.15 or "significant" signal). System proposes, human approves.',
    },

    red: {
      meaning: 'Structural Event',
      flywheel_eligible: false,  // CRITICAL: Strategic ops cannot become skills
      thresholds: {
        minScoreDelta: ZONE_THRESHOLDS.yellowMax,
        signalLevel: 'critical',
        tierCrossing: true,
      },
      allows: [
        'compile_strategic_briefing',
        'surface_implications',
        'present_historical_context',
        'urgent_notification',
      ],
      requiresHumanDecision: true,  // ALL actions require human decision
      forbids: [
        'suggest_investment_decisions',
        'recommend_strategic_pivots',
        'auto_execute_anything',
      ],
      description: 'Structural event (delta >= 0.15, "critical" signal, or tier crossing). Human decision required for ALL actions.',
    },
  },
}

/**
 * Serialize zones schema to YAML-like string for display
 */
export function serializeZonesSchema(schema: ZonesSchema): string {
  let yaml = `# SIGNAL WATCH ZONES SCHEMA — Competitive Intelligence Governance
#
# Zone Thresholds:
#   GREEN  → Score delta < 0.05, routine signals only
#   YELLOW → Score delta 0.05-0.15, or significant signals
#   RED    → Score delta >= 0.15, critical signals, or tier crossing
#
# Key Governance Rules:
#   - GREEN zone operations can become skills (flywheel eligible)
#   - YELLOW zone operations require human approval
#   - RED zone operations NEVER become skills (governance lock)
#
# The zone determines autonomy level, not capability level.
# A Tier 3 model can still only execute what the zone allows.

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
    if (zone.forbids) {
      yaml += `    forbids:\n`
      for (const action of zone.forbids) {
        yaml += `      - ${action}\n`
      }
    }
    if (zone.requiresApproval) {
      yaml += `    requires_approval:\n`
      for (const action of zone.requiresApproval) {
        yaml += `      - ${action}\n`
      }
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
    green: 'Routine',
    yellow: 'Significant',
    red: 'Structural',
  }
  return labels[zone]
}

/**
 * Get zone threshold description for UI
 */
export function getZoneThresholdLabel(zone: 'green' | 'yellow' | 'red'): string {
  const labels = {
    green: 'Δ < 0.05',
    yellow: '0.05 ≤ Δ < 0.15',
    red: 'Δ ≥ 0.15',
  }
  return labels[zone]
}
