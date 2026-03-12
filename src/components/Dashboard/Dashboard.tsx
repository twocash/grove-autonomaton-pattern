/**
 * Dashboard — Real-time metrics proving the Ratchet
 *
 * Shows: Total Cost, Interaction Count, Average Tier, % Local, Skills Fired
 * The key insight: cost trends DOWN while capability stays flat.
 *
 * v0.8.1: Collapsed to single-line ticker (Layout Economy)
 */

import { useMetrics, useSkills } from '../../state/context'
import { formatCost } from '../../config/tiers'

export function Dashboard() {
  const metrics = useMetrics()
  const skills = useSkills()

  const avgTier = metrics.tierHistory.length > 0
    ? (metrics.tierHistory.reduce((a, b) => a + b, 0) / metrics.tierHistory.length)
    : null

  const pctLocal = metrics.interactionCount > 0
    ? Math.round((metrics.localCount / metrics.interactionCount) * 100)
    : 0

  return (
    <section className="flex items-center justify-center gap-8 py-2 border-b border-grove-border bg-grove-bg2">
      <MetricInline label="Cost" value={formatCost(metrics.totalCost)} />
      <MetricInline label="Interactions" value={metrics.interactionCount.toString()} />
      <MetricInline
        label="Avg Tier"
        value={avgTier !== null ? avgTier.toFixed(1) : '—'}
        highlight={avgTier !== null && avgTier < 1.5}
      />
      <MetricInline
        label="Local"
        value={`${pctLocal}%`}
        highlight={pctLocal > 50}
      />
      <MetricInline
        label="Skills"
        value={skills.length.toString()}
        highlight={skills.length > 0}
        accentColor="text-tier-0"
      />
    </section>
  )
}

interface MetricInlineProps {
  label: string
  value: string
  highlight?: boolean
  accentColor?: string
}

function MetricInline({ label, value, highlight, accentColor = 'text-grove-amber' }: MetricInlineProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[10px] text-grove-text-dim uppercase">{label}:</span>
      <span className={`font-mono text-xs ${highlight ? 'text-grove-green' : accentColor}`}>
        {value}
      </span>
    </div>
  )
}
