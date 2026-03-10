/**
 * Demo Signals — Sample competitive intelligence signals for demo mode
 */

import type { ClassifiedSignal, SignalLevel } from '../../state/types'

/**
 * Generate a unique ID for demo signals
 */
function signalId(prefix: string, index: number): string {
  return `${prefix}-${Date.now()}-${index}`
}

/**
 * Demo signals representing various competitive intelligence scenarios
 */
export const demoSignals: ClassifiedSignal[] = [
  // =========================================================================
  // CRITICAL SIGNALS (RED ZONE) — Structural events
  // =========================================================================
  {
    id: signalId('sig', 1),
    sourceId: 'techcrunch',
    sourceName: 'TechCrunch',
    sourceType: 'rss',
    sourceReliability: 0.85,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    title: 'OpenAI Announces GPT-5 with 10x Performance Gains',
    content: 'OpenAI has unveiled GPT-5, claiming breakthrough performance across all benchmarks. The model demonstrates significant improvements in reasoning, coding, and multimodal understanding. Enterprise pricing starts at $0.03/1K tokens.',
    url: 'https://techcrunch.com/openai-gpt5-announcement',
    metadata: { author: 'Kyle Wiggers', category: 'AI' },
    classificationId: 'cls-001',
    relevance: 0.98,
    novelty: 0.95,
    threatLevel: 'critical' as SignalLevel,
    impactLevel: 'high',
    subjects: [
      {
        subjectId: 'openai',
        subjectName: 'OpenAI',
        relevanceScore: 0.99,
        proposedScoreDelta: 0.18,
        deltaReason: 'Major model release with significant capability jump',
      },
    ],
    keywords: ['gpt-5', 'openai', 'benchmark', 'performance'],
    tier: 3,
    zone: 'red',
    confidence: 0.95,
  },

  // =========================================================================
  // SIGNIFICANT SIGNALS (YELLOW ZONE) — Notable shifts
  // =========================================================================
  {
    id: signalId('sig', 2),
    sourceId: 'bloomberg',
    sourceName: 'Bloomberg',
    sourceType: 'rss',
    sourceReliability: 0.92,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    title: 'Anthropic Raises $2B at $15B Valuation',
    content: 'Anthropic has closed a $2 billion funding round led by Google, valuing the company at $15 billion. The funds will accelerate Claude development and expand enterprise offerings.',
    url: 'https://bloomberg.com/anthropic-funding-round',
    metadata: { author: 'Dina Bass', category: 'Funding' },
    classificationId: 'cls-002',
    relevance: 0.92,
    novelty: 0.78,
    threatLevel: 'significant' as SignalLevel,
    impactLevel: 'high',
    subjects: [
      {
        subjectId: 'anthropic',
        subjectName: 'Anthropic',
        relevanceScore: 0.95,
        proposedScoreDelta: 0.08,
        deltaReason: 'Major funding extends runway and validates position',
      },
      {
        subjectId: 'google',
        subjectName: 'Google DeepMind',
        relevanceScore: 0.45,
        proposedScoreDelta: 0.02,
        deltaReason: 'Strategic investment in competitor signals hedging',
      },
    ],
    keywords: ['anthropic', 'funding', 'google', 'valuation'],
    tier: 2,
    zone: 'yellow',
    confidence: 0.88,
  },
  {
    id: signalId('sig', 3),
    sourceId: 'reuters',
    sourceName: 'Reuters',
    sourceType: 'rss',
    sourceReliability: 0.95,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    title: 'Google Cuts Gemini API Pricing by 50%',
    content: 'Google has announced aggressive price cuts for Gemini Pro and Ultra APIs, positioning the models as cost-competitive alternatives to GPT-4. Enterprise customers report switching consideration.',
    url: 'https://reuters.com/google-gemini-pricing',
    metadata: { author: 'Jane Doe', category: 'Pricing' },
    classificationId: 'cls-003',
    relevance: 0.88,
    novelty: 0.72,
    threatLevel: 'significant' as SignalLevel,
    impactLevel: 'medium',
    subjects: [
      {
        subjectId: 'google',
        subjectName: 'Google DeepMind',
        relevanceScore: 0.92,
        proposedScoreDelta: 0.06,
        deltaReason: 'Aggressive pricing may accelerate enterprise adoption',
      },
      {
        subjectId: 'openai',
        subjectName: 'OpenAI',
        relevanceScore: 0.55,
        proposedScoreDelta: -0.03,
        deltaReason: 'Price pressure from competitor',
      },
    ],
    keywords: ['google', 'gemini', 'pricing', 'api'],
    tier: 2,
    zone: 'yellow',
    confidence: 0.85,
  },
  {
    id: signalId('sig', 4),
    sourceId: 'venturebeat',
    sourceName: 'VentureBeat',
    sourceType: 'rss',
    sourceReliability: 0.80,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    title: 'Mistral AI Launches Enterprise Platform with SOC 2 Compliance',
    content: 'European AI startup Mistral AI has launched La Plateforme Enterprise, featuring SOC 2 Type II compliance, dedicated instances, and fine-tuning capabilities. The move positions Mistral as a credible enterprise alternative.',
    url: 'https://venturebeat.com/mistral-enterprise-platform',
    metadata: { author: 'Sharon Goldman', category: 'Product' },
    classificationId: 'cls-004',
    relevance: 0.82,
    novelty: 0.85,
    threatLevel: 'significant' as SignalLevel,
    impactLevel: 'medium',
    subjects: [
      {
        subjectId: 'mistral',
        subjectName: 'Mistral AI',
        relevanceScore: 0.95,
        proposedScoreDelta: 0.12,
        deltaReason: 'Enterprise readiness significantly increases competitive threat',
      },
    ],
    keywords: ['mistral', 'enterprise', 'soc2', 'platform'],
    tier: 2,
    zone: 'yellow',
    confidence: 0.82,
  },

  // =========================================================================
  // ROUTINE SIGNALS (GREEN ZONE) — Standard monitoring
  // =========================================================================
  {
    id: signalId('sig', 5),
    sourceId: 'hackernews',
    sourceName: 'Hacker News',
    sourceType: 'rss',
    sourceReliability: 0.70,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    title: 'Meta Releases Llama 3 8B Model Weights',
    content: 'Meta has released the weights for Llama 3 8B, the smallest model in the Llama 3 family. The release continues Meta\'s open-source AI strategy.',
    url: 'https://news.ycombinator.com/llama-3-8b',
    metadata: { points: 450, comments: 234 },
    classificationId: 'cls-005',
    relevance: 0.75,
    novelty: 0.45,
    threatLevel: 'routine' as SignalLevel,
    impactLevel: 'low',
    subjects: [
      {
        subjectId: 'meta',
        subjectName: 'Meta AI',
        relevanceScore: 0.88,
        proposedScoreDelta: 0.03,
        deltaReason: 'Incremental release, continues existing strategy',
      },
    ],
    keywords: ['meta', 'llama', 'open-source', 'weights'],
    tier: 1,
    zone: 'green',
    confidence: 0.78,
  },
  {
    id: signalId('sig', 6),
    sourceId: 'wired',
    sourceName: 'Wired',
    sourceType: 'rss',
    sourceReliability: 0.82,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    title: 'Anthropic Updates Claude System Prompts for Better Safety',
    content: 'Anthropic has released updated system prompts for Claude, improving safety behaviors and reducing harmful outputs. The update applies to all Claude models via the API.',
    url: 'https://wired.com/anthropic-claude-safety-update',
    metadata: { author: 'Will Knight', category: 'AI Safety' },
    classificationId: 'cls-006',
    relevance: 0.68,
    novelty: 0.35,
    threatLevel: 'routine' as SignalLevel,
    impactLevel: 'low',
    subjects: [
      {
        subjectId: 'anthropic',
        subjectName: 'Anthropic',
        relevanceScore: 0.82,
        proposedScoreDelta: 0.01,
        deltaReason: 'Routine safety improvement, expected behavior',
      },
    ],
    keywords: ['anthropic', 'claude', 'safety', 'system prompt'],
    tier: 1,
    zone: 'green',
    confidence: 0.72,
  },
  {
    id: signalId('sig', 7),
    sourceId: 'the-verge',
    sourceName: 'The Verge',
    sourceType: 'rss',
    sourceReliability: 0.78,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    title: 'Google Adds Gemini to Workspace Apps',
    content: 'Google is rolling out Gemini integration across Workspace apps including Docs, Sheets, and Slides. The feature is available to Workspace Enterprise customers.',
    url: 'https://theverge.com/google-gemini-workspace',
    metadata: { author: 'Tom Warren', category: 'Product' },
    classificationId: 'cls-007',
    relevance: 0.72,
    novelty: 0.40,
    threatLevel: 'routine' as SignalLevel,
    impactLevel: 'low',
    subjects: [
      {
        subjectId: 'google',
        subjectName: 'Google DeepMind',
        relevanceScore: 0.85,
        proposedScoreDelta: 0.02,
        deltaReason: 'Expected product integration, follows announced roadmap',
      },
    ],
    keywords: ['google', 'gemini', 'workspace', 'integration'],
    tier: 1,
    zone: 'green',
    confidence: 0.75,
  },
]

/**
 * Get signals by zone for demo filtering
 */
export function getSignalsByZone(zone: 'green' | 'yellow' | 'red'): ClassifiedSignal[] {
  return demoSignals.filter(s => s.zone === zone)
}

/**
 * Get signals for a specific subject
 */
export function getSignalsForSubject(subjectId: string): ClassifiedSignal[] {
  return demoSignals.filter(s =>
    s.subjects.some(sub => sub.subjectId === subjectId)
  )
}
