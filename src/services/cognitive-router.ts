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
import { ZONE_THRESHOLDS } from '../config/zones'

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
 * Reads threshold from routingConfig.skillPromotion.afterNApprovals (CONFIG-DRIVEN)
 */
export function shouldProposeSkill(
  intent: string,
  patternCounts: Record<string, number>,
  skills: Skill[],
  routingConfig?: RoutingConfig
): boolean {
  // READ FROM CONFIG — not hardcoded! (Manifesto Directive #3)
  const threshold = routingConfig?.skillPromotion?.afterNApprovals ?? 5
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
    // "Brief me on" patterns (flywheel-eligible)
    'brief_me_on:competitor': 'Research briefing on competitor → structured analysis',
    'brief_me_on:partner': 'Research briefing on partner → structured analysis',
    'brief_me_on:market': 'Research briefing on market → structured analysis',
    'brief_me_on:technology': 'Research briefing on technology → structured analysis',
    'brief_me_on:regulatory': 'Research briefing on regulatory → structured analysis',
    'brief_me_on:general': 'Research briefing on topic → structured analysis',

    // Score adjustment patterns (Signal Watch flywheel)
    'approve_adjustment:competitor:minor': 'Minor competitor score change (<5%) → auto-approve',
    'approve_adjustment:competitor:medium': 'Medium competitor score change (5-15%) → auto-approve',
    'approve_adjustment:partner:minor': 'Minor partner score change (<5%) → auto-approve',
    'approve_adjustment:partner:medium': 'Medium partner score change (5-15%) → auto-approve',
    'approve_adjustment:market:minor': 'Minor market score change (<5%) → auto-approve',
    'approve_adjustment:market:medium': 'Medium market score change (5-15%) → auto-approve',
    'approve_adjustment:technology:minor': 'Minor technology score change (<5%) → auto-approve',
    'approve_adjustment:technology:medium': 'Medium technology score change (5-15%) → auto-approve',
    'approve_adjustment:regulatory:minor': 'Minor regulatory score change (<5%) → auto-approve',
    'approve_adjustment:regulatory:medium': 'Medium regulatory score change (5-15%) → auto-approve',
  }
  return patterns[intent] || `Pattern: ${intent}`
}

/**
 * Categorize a delta into minor/medium/major
 * Uses ZONE_THRESHOLDS from zones.ts (CONFIG-DRIVEN per Manifesto Directive #3)
 */
export function categorizeDelta(delta: number): 'minor' | 'medium' | 'major' {
  const absDelta = Math.abs(delta)
  // READ FROM CONFIG — not hardcoded! (Anti-Pattern #2)
  if (absDelta < ZONE_THRESHOLDS.greenMax) return 'minor'   // GREEN zone
  if (absDelta < ZONE_THRESHOLDS.yellowMax) return 'medium' // YELLOW zone
  return 'major'                                             // RED zone
}

/**
 * Generate a pattern key for score adjustment approvals
 */
export function getAdjustmentPatternKey(
  subjectType: string,
  delta: number
): string {
  const category = categorizeDelta(delta)
  // Major adjustments (≥15%) are always human-only, no flywheel
  if (category === 'major') return ''
  return `approve_adjustment:${subjectType}:${category}`
}

/**
 * Extract "brief me on" pattern key from a query
 * Returns pattern like "brief_me_on:competitor" or "brief_me_on:general"
 */
export function getBriefMeOnPatternKey(
  query: string,
  subjects: Array<{ id: string; name: string; type: string; keywords: string[] }>
): string {
  const lower = query.toLowerCase()

  // Check for "brief me" trigger phrases
  const triggers = ['brief me on', 'brief me about', 'what about', 'update on', 'news on', 'tell me about']
  const isBriefRequest = triggers.some(trigger => lower.includes(trigger))
  if (!isBriefRequest) return ''

  // Find which subject they're asking about
  const matchedSubject = subjects.find(s =>
    s.keywords.some(kw => lower.includes(kw.toLowerCase())) ||
    lower.includes(s.name.toLowerCase())
  )

  if (matchedSubject) {
    return `brief_me_on:${matchedSubject.type}`
  }
  return 'brief_me_on:general'
}
