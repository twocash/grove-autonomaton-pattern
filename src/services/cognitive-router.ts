/**
 * Cognitive Router — Intent Classification Engine
 *
 * This proves Claim #2: Intelligent routing minimizes cost.
 * The router classifies intent, selects tier, and checks skill cache.
 *
 * In Demo mode: keyword matching against routing.config
 * In Interactive mode: actual LLM inference (not implemented yet)
 */

import type { RoutingConfig, Tier, Zone, Skill } from '../state/types'
import { TIER_CONFIG } from '../config/tiers'

export interface RoutingDecision {
  intent: string
  tier: Tier
  zone: Zone
  confidence: number
  cost: number
  sovereignty: 'local' | 'cloud'
  skillMatch: Skill | null
  reasoning: string
}

/**
 * Classify input and route to appropriate tier
 */
export function classifyIntent(
  input: string,
  routingConfig: RoutingConfig,
  skills: Skill[]
): RoutingDecision {
  const normalized = input.toLowerCase().trim()

  // Phase 1: Check skill cache (Tier 0)
  // If we have a learned skill that matches, use it
  const matchedSkill = skills.find((skill) => {
    const intentConfig = routingConfig.intents[skill.intentMatch]
    if (!intentConfig) return false
    return intentConfig.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
  })

  if (matchedSkill) {
    return {
      intent: matchedSkill.intentMatch,
      tier: 0,
      zone: routingConfig.intents[matchedSkill.intentMatch]?.zone || 'green',
      confidence: 0.95, // High confidence for cached skills
      cost: TIER_CONFIG[0].cost,
      sovereignty: TIER_CONFIG[0].sovereignty,
      skillMatch: matchedSkill,
      reasoning: `Matched cached skill: ${matchedSkill.pattern}`,
    }
  }

  // Phase 2: Match against intent keywords
  let bestMatch: { intent: string; score: number } | null = null

  for (const [intentName, config] of Object.entries(routingConfig.intents)) {
    for (const keyword of config.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        const score = keyword.length / normalized.length // Rough relevance
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { intent: intentName, score }
        }
      }
    }
  }

  if (bestMatch) {
    const intentConfig = routingConfig.intents[bestMatch.intent]
    const tier = intentConfig.tier
    return {
      intent: bestMatch.intent,
      tier,
      zone: intentConfig.zone,
      confidence: Math.min(0.9, 0.5 + bestMatch.score),
      cost: TIER_CONFIG[tier].cost,
      sovereignty: TIER_CONFIG[tier].sovereignty,
      skillMatch: null,
      reasoning: `Matched intent "${bestMatch.intent}" via keywords`,
    }
  }

  // Phase 3: Ad-hoc query — route to Tier 2 for general handling
  // This is a governed fallback (yellow zone, flywheel eligible)
  return {
    intent: 'ad_hoc_query',
    tier: 2,
    zone: 'yellow',
    confidence: 0.3,
    cost: TIER_CONFIG[2].cost,
    sovereignty: TIER_CONFIG[2].sovereignty,
    skillMatch: null,
    reasoning: 'No intent match — routing as ad-hoc query',
  }
}

/**
 * Check if a pattern has reached the skill proposal threshold
 */
export function shouldProposeSkill(
  intent: string,
  patternCounts: Record<string, number>,
  skills: Skill[],
  threshold = 3
): boolean {
  const count = patternCounts[intent] || 0
  const alreadyHasSkill = skills.some((s) => s.intentMatch === intent)
  return count >= threshold && !alreadyHasSkill
}

/**
 * Generate a human-readable pattern description
 */
export function generatePatternDescription(intent: string): string {
  const patterns: Record<string, string> = {
    capture_idea: 'Quick thought capture → immediate acknowledgment',
    summarize_notes: 'Notes summary request → structured overview',
    research_topic: 'Research request → comprehensive analysis',
    draft_email: 'Email draft request → formatted template',
    propose_skill: 'Skill proposal → automation opportunity',
    analyze_data: 'Data analysis request → statistical insights',
  }
  return patterns[intent] || `Pattern: ${intent}`
}
