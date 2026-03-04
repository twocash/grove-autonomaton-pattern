/**
 * Dashboard — Real-time metrics proving the Ratchet
 *
 * Shows: Total Cost, Interaction Count, Average Tier, % Local, Skills Fired
 * The key insight: cost trends DOWN while capability stays flat.
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
    <section className="border-b border-slate-700 px-6 py-3 bg-slate-800/30">
      <div className="flex items-center justify-center gap-8">
        <Metric
          label="Total Cost"
          value={formatCost(metrics.totalCost)}
          color="text-white"
        />
        <Metric
          label="Interactions"
          value={metrics.interactionCount.toString()}
          color="text-white"
        />
        <Metric
          label="Avg Tier"
          value={avgTier !== null ? avgTier.toFixed(1) : '—'}
          color={avgTier !== null && avgTier < 1.5 ? 'text-green-400' : 'text-white'}
        />
        <Metric
          label="% Local"
          value={`${pctLocal}%`}
          color={pctLocal > 50 ? 'text-green-400' : 'text-white'}
        />
        <Metric
          label="Skills"
          value={skills.length.toString()}
          color="text-tier-0"
        />
      </div>
    </section>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-sm">
      <span className="text-slate-400">{label}: </span>
      <span className={`font-mono font-medium ${color}`}>{value}</span>
    </div>
  )
}
