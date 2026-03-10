/**
 * WatchlistDashboard — Overview of all monitored subjects
 *
 * Shows competitive landscape with scores, trends, and pending adjustments.
 */

import type { WatchlistSubject, ScoreAdjustment } from '../../state/types'
import { SubjectCard } from './SubjectCard'

interface WatchlistDashboardProps {
  subjects?: WatchlistSubject[]
  pendingAdjustments?: ScoreAdjustment[]
  onSubjectSelect?: (subject: WatchlistSubject) => void
}

export function WatchlistDashboard({
  subjects = [],
  pendingAdjustments = [],
  onSubjectSelect,
}: WatchlistDashboardProps) {
  // Group by tier
  const primarySubjects = subjects.filter(s => s.tier === 'primary')
  const secondarySubjects = subjects.filter(s => s.tier === 'secondary')
  const emergingSubjects = subjects.filter(s => s.tier === 'emerging')

  // Get pending delta for a subject
  const getPendingDelta = (subjectId: string): number | undefined => {
    const adjustment = pendingAdjustments.find(a => a.subjectId === subjectId && a.status === 'pending')
    return adjustment?.delta
  }

  // Calculate summary stats (normalize scores to 0-1 range)
  const normalizeScore = (s: number) => s > 1 ? s / 100 : Math.max(0, Math.min(1, s))
  const avgScore = subjects.reduce((sum, s) => sum + normalizeScore(s.baselineScore), 0) / subjects.length
  const pendingCount = pendingAdjustments.filter(a => a.status === 'pending').length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-grove-border p-4 bg-grove-bg2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-grove-text">Competitive Watchlist</h2>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-grove-text-dim">{subjects.length} subjects</span>
            {pendingCount > 0 && (
              <span className="text-zone-yellow">
                {pendingCount} pending adjustments
              </span>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatBox label="Avg Score" value={`${(avgScore * 100).toFixed(0)}`} />
          <StatBox label="Primary" value={primarySubjects.length.toString()} color="amber" />
          <StatBox label="Secondary" value={secondarySubjects.length.toString()} color="tier-2" />
          <StatBox label="Emerging" value={emergingSubjects.length.toString()} color="tier-1" />
        </div>
      </div>

      {/* Subject Grid */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {/* Primary Tier */}
        {primarySubjects.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xs font-mono text-grove-amber uppercase tracking-wider mb-3">
              Primary Competitors
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {primarySubjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  recentDelta={getPendingDelta(subject.id)}
                  onClick={() => onSubjectSelect?.(subject)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Secondary Tier */}
        {secondarySubjects.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xs font-mono text-tier-2 uppercase tracking-wider mb-3">
              Secondary Competitors
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {secondarySubjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  recentDelta={getPendingDelta(subject.id)}
                  onClick={() => onSubjectSelect?.(subject)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Emerging Tier */}
        {emergingSubjects.length > 0 && (
          <section className="mb-6">
            <h3 className="text-xs font-mono text-tier-1 uppercase tracking-wider mb-3">
              Emerging Players
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {emergingSubjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  recentDelta={getPendingDelta(subject.id)}
                  onClick={() => onSubjectSelect?.(subject)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-grove-border p-3 bg-grove-bg2">
        <div className="flex items-center justify-between text-xs text-grove-text-dim">
          <span>
            Score range: 0-100 | Thresholds: Δ&lt;5 (green), 5≤Δ&lt;15 (yellow), Δ≥15 (red)
          </span>
          <span className="font-mono">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  const colorClass = color ? `text-${color === 'amber' ? 'grove-amber' : color}` : 'text-grove-text'

  return (
    <div className="bg-grove-bg border border-grove-border p-3">
      <div className={`font-mono text-2xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-grove-text-dim uppercase">{label}</div>
    </div>
  )
}

export default WatchlistDashboard
