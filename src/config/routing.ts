/**
 * Signal Watch Routing Configuration
 *
 * This is the declarative source of truth for competitive intelligence intent routing.
 * Edit this to change how the system behaves — no code changes required.
 *
 * Each intent specifies:
 * - tier: Which cognitive tier handles it (0=cached, 1=cheap, 2=premium, 3=apex)
 * - zone: Governance level (green=auto, yellow=approve, red=human-only)
 * - keywords: Patterns for demo mode intent matching
 *
 * Zone Thresholds (per Sovereign Manifesto):
 * - GREEN: All score deltas < 0.05, no signals above "routine"
 * - YELLOW: Any delta 0.05-0.15, or any "significant" signal
 * - RED: Any delta >= 0.15, "critical" signal, or tier crossing detected
 */

import type { RoutingConfig } from '../state/types'

export const defaultRoutingConfig: RoutingConfig = {
  // Skill flywheel configuration (per Sovereign Manifesto)
  skillPromotion: {
    afterNApprovals: 5,            // Manifesto: after_n_approvals: 5
    promotableTiers: [1, 2],       // Tiers eligible for promotion to Tier 0
    scoreAdjustmentPatterns: true, // Enable flywheel for score adjustments
  },

  intents: {
    // =========================================================================
    // TIER 0 — Cached Skills (Local, Instant, Free)
    // Deterministic operations that don't require LLM inference
    // =========================================================================
    fetch_rss: {
      tier: 0,
      zone: 'green',
      description: 'Pull from configured RSS/API feeds',
      keywords: ['fetch', 'rss', 'pull', 'refresh', 'feed', 'update feeds'],
    },

    apply_keyword_filters: {
      tier: 0,
      zone: 'green',
      description: 'Apply learned keyword filters to signals',
      keywords: ['filter', 'keyword', 'match', 'apply filter'],
    },

    execute_skills: {
      tier: 0,
      zone: 'green',
      description: 'Execute cached skill patterns',
      keywords: [],  // Programmatic only — skills fire automatically
    },

    log_telemetry: {
      tier: 0,
      zone: 'green',
      description: 'Write telemetry entry to audit ledger',
      keywords: [],  // Programmatic only
    },

    log_briefing: {
      tier: 0,
      zone: 'green',
      description: 'Log briefing to archive',
      keywords: ['log', 'archive briefing'],
    },

    archive_low_relevance: {
      tier: 0,
      zone: 'green',
      description: 'Archive low-relevance signals automatically',
      keywords: ['archive', 'low relevance', 'dismiss'],
    },

    // =========================================================================
    // TIER 1 — Cheap Classification (Fast, Low-Cost)
    // Simple classification and routine operations
    // =========================================================================
    classify_keyword_signals: {
      tier: 1,
      zone: 'green',
      description: 'Classify signals by keyword match',
      keywords: ['classify', 'keyword', 'tag', 'categorize'],
    },

    compile_routine_briefing: {
      tier: 1,
      zone: 'green',
      description: 'Compile routine daily briefing (no adjustments)',
      keywords: ['briefing', 'routine', 'daily', 'summary', 'digest'],
    },

    quick_relevance: {
      tier: 1,
      zone: 'green',
      description: 'Quick relevance scoring for new signals',
      keywords: ['relevance', 'quick', 'score', 'triage'],
    },

    // =========================================================================
    // TIER 2 — Premium Classification (Standard Cloud Inference)
    // Complex analysis requiring more capable models
    // =========================================================================
    classify_novel_signals: {
      tier: 2,
      zone: 'yellow',
      description: 'Classify signals without keyword match',
      keywords: ['novel', 'new signal', 'unrecognized', 'unknown'],
    },

    multi_subject_correlation: {
      tier: 2,
      zone: 'yellow',
      description: 'Correlate signals across multiple watchlist subjects',
      keywords: ['correlate', 'multi', 'cross-subject', 'connect', 'pattern'],
    },

    ad_hoc_scan: {
      tier: 2,
      zone: 'yellow',
      description: 'User-requested ad-hoc intelligence scan',
      keywords: ['scan', 'ad-hoc', 'manual', 'investigate', 'research'],
    },

    brief_me_on: {
      tier: 2,
      zone: 'yellow',
      description: 'Research briefing on a specific subject',
      keywords: ['brief me on', 'brief me about', 'what about', 'update on', 'news on', 'tell me about'],
    },

    draft_briefing: {
      tier: 2,
      zone: 'yellow',
      description: 'Draft briefing with proposed adjustments for review',
      keywords: ['draft', 'briefing', 'prepare'],
    },

    highlight_adjustments: {
      tier: 2,
      zone: 'yellow',
      description: 'Highlight proposed score adjustments for review',
      keywords: ['highlight', 'adjustment', 'delta', 'change'],
    },

    request_analysis: {
      tier: 2,
      zone: 'yellow',
      description: 'Request deeper analysis of signals',
      keywords: ['analyze', 'deeper', 'request analysis', 'investigate'],
    },

    // =========================================================================
    // TIER 2 — YELLOW (Requires Approval)
    // Operations that change system state
    // =========================================================================
    update_baseline_scores: {
      tier: 2,
      zone: 'yellow',
      description: 'Update baseline competitive scores (requires approval)',
      keywords: ['update', 'baseline', 'score', 'adjust score'],
    },

    promote_skill: {
      tier: 2,
      zone: 'yellow',
      description: 'Promote signal pattern to cached skill',
      keywords: ['promote', 'skill', 'learn', 'automate'],
    },

    modify_source_reliability: {
      tier: 2,
      zone: 'yellow',
      description: 'Modify source reliability rating',
      keywords: ['reliability', 'source rating', 'trust', 'weight'],
    },

    // =========================================================================
    // TIER 3 — Apex Analysis (Maximum Capability)
    // Strategic analysis requiring highest-capability models
    // =========================================================================
    analyze_score_shifting_events: {
      tier: 3,
      zone: 'yellow',
      description: 'Analyze events that may shift competitive scores',
      keywords: ['analyze', 'shift', 'major', 'event', 'impact'],
    },

    historical_patterns: {
      tier: 3,
      zone: 'yellow',
      description: 'Analyze historical patterns for prediction',
      keywords: ['historical', 'pattern', 'trend', 'predict', 'history'],
    },

    // =========================================================================
    // TIER 3 — RED ZONE (Human Decision Required)
    // Strategic operations where system surfaces info only
    // =========================================================================
    strategic_briefing: {
      tier: 3,
      zone: 'red',
      description: 'Compile strategic briefing with tier implications',
      keywords: ['strategic', 'implications', 'critical', 'urgent'],
    },

    surface_implications: {
      tier: 3,
      zone: 'red',
      description: 'Surface strategic implications for human decision',
      keywords: ['implications', 'surface', 'present', 'show'],
    },

    // =========================================================================
    // FORBIDDEN INTENTS — Red Zone, Never Auto-Execute
    // =========================================================================
    suggest_investment_decisions: {
      tier: 3,
      zone: 'red',
      description: 'FORBIDDEN: Never suggest investment decisions',
      keywords: ['invest', 'buy', 'sell', 'trade', 'stock'],
    },

    recommend_strategic_pivots: {
      tier: 3,
      zone: 'red',
      description: 'FORBIDDEN: Never recommend strategic pivots autonomously',
      keywords: ['pivot', 'strategic change', 'direction'],
    },

    // =========================================================================
    // FALLBACK — Unmapped queries
    // =========================================================================
    ad_hoc_query: {
      tier: 2,
      zone: 'yellow',
      description: 'Unmapped custom user prompt',
      keywords: [],  // No keywords — this is the fallback
    },
  },
}

/**
 * Serialize config to YAML-like string for display in editor
 */
export function serializeRoutingConfig(config: RoutingConfig): string {
  let yaml = '# SIGNAL WATCH ROUTING CONFIGURATION\n'
  yaml += '# Zone Thresholds: GREEN (<0.05 delta), YELLOW (0.05-0.15), RED (>=0.15)\n\n'
  yaml += 'intents:\n'

  for (const [name, intent] of Object.entries(config.intents)) {
    yaml += `  ${name}:\n`
    yaml += `    tier: ${intent.tier}\n`
    yaml += `    zone: ${intent.zone}\n`
    yaml += `    description: "${intent.description}"\n`
  }

  return yaml
}

/**
 * Parse YAML-like string back to config object
 * Simple parser for demo — not a full YAML implementation
 */
export function parseRoutingConfig(yaml: string): RoutingConfig | { error: string } {
  try {
    const config: RoutingConfig = { intents: {} }
    const lines = yaml.split('\n')
    let currentIntent: string | null = null

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'intents:' || trimmed.startsWith('#')) continue

      // Intent name: exactly 2-space indent, word characters only, ends with colon
      const intentMatch = line.match(/^  (\w+):$/)
      if (intentMatch) {
        currentIntent = intentMatch[1]
        config.intents[currentIntent] = {
          tier: 1,
          zone: 'green',
          description: '',
          keywords: defaultRoutingConfig.intents[currentIntent]?.keywords || [],
        }
        continue
      }

      // Property: exactly 4-space indent, "key: value" format
      if (currentIntent) {
        const propMatch = line.match(/^    (\w+): (.+)$/)
        if (propMatch) {
          const [, key, value] = propMatch
          const intent = config.intents[currentIntent]

          if (key === 'tier') {
            const tier = parseInt(value)
            if (tier >= 0 && tier <= 3) intent.tier = tier as 0 | 1 | 2 | 3
          } else if (key === 'zone') {
            if (['green', 'yellow', 'red'].includes(value)) {
              intent.zone = value as 'green' | 'yellow' | 'red'
            }
          } else if (key === 'description') {
            intent.description = value.replace(/^"|"$/g, '')
          }
        }
      }
    }

    return config
  } catch (e) {
    return { error: `Parse error: ${e}` }
  }
}
