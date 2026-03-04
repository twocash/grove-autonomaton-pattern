/**
 * TelemetryStream — Real-time audit trail (Terminal aesthetic)
 *
 * This proves Claim #7: Transparency by construction.
 * Every routing decision is a traced artifact.
 *
 * Features:
 * - Live JSON stream of every interaction
 * - Click entry → highlights corresponding interaction
 * - Export audit log as JSON
 * - Terminal-style green tint for visual distinction from chat UI
 */

import { useTelemetry, useAppDispatch, useAppState } from '../../state/context'

export function TelemetryStream() {
  const telemetry = useTelemetry()
  const dispatch = useAppDispatch()
  const { selectedTelemetryId } = useAppState()

  const handleEntryClick = (id: string) => {
    dispatch({ type: 'SELECT_TELEMETRY', id: selectedTelemetryId === id ? null : id })
    dispatch({ type: 'SELECT_INTERACTION', id: selectedTelemetryId === id ? null : id })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(telemetry, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `autonomaton-audit-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="h-48 border-t border-slate-700 bg-slate-950 flex flex-col terminal-stream">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-green-500 animate-pulse">●</span>
          <span className="text-sm font-medium text-green-400/80">
            Telemetry Stream
          </span>
          {telemetry.length > 0 && (
            <span className="text-xs text-green-600">
              ({telemetry.length} entries)
            </span>
          )}
        </div>
        <button
          onClick={handleExport}
          className="text-xs text-green-400 hover:text-green-300 transition-colors border border-green-800 hover:border-green-600 px-2 py-0.5 rounded"
        >
          Export Audit Log
        </button>
      </div>

      {/* Stream */}
      <div className="flex-1 p-2 overflow-y-auto scrollbar-thin font-mono text-xs">
        {telemetry.length === 0 ? (
          <div className="text-green-700 p-2 space-y-1">
            <p><span className="text-green-500">&gt;</span> Telemetry entries will appear here...</p>
            <p><span className="text-green-500">&gt;</span> Each interaction generates a structured audit record</p>
            <p><span className="text-green-500">&gt;</span> Click any entry to highlight the corresponding interaction</p>
            <p className="text-green-800 mt-4">_</p>
          </div>
        ) : (
          <div className="space-y-1">
            {telemetry.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleEntryClick(entry.id)}
                className={`
                  telemetry-entry cursor-pointer
                  ${selectedTelemetryId === entry.id ? 'selected' : ''}
                `}
              >
                <span className="text-green-600 font-semibold">{entry.timestamp.slice(11, 19)}</span>
                <span className="text-slate-600"> │ </span>
                <span className="text-green-400">{entry.intent}</span>
                <span className="text-slate-600"> │ </span>
                <TierBadge tier={entry.tier} />
                <span className="text-slate-600"> │ </span>
                <ZoneBadge zone={entry.zone} />
                <span className="text-slate-600"> │ </span>
                <span className="text-green-300">${entry.cost.toFixed(4)}</span>
                {entry.skillMatch && (
                  <>
                    <span className="text-slate-600"> │ </span>
                    <span className="text-tier-0">⚡cached</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TierBadge({ tier }: { tier: number }) {
  const colors: Record<number, string> = {
    0: 'text-tier-0',
    1: 'text-tier-1',
    2: 'text-tier-2',
    3: 'text-tier-3',
  }
  return <span className={colors[tier] || 'text-slate-400'}>T{tier}</span>
}

function ZoneBadge({ zone }: { zone: string }) {
  const colors: Record<string, string> = {
    green: 'text-zone-green',
    yellow: 'text-zone-yellow',
    red: 'text-zone-red',
  }
  return <span className={colors[zone] || 'text-slate-400'}>{zone}</span>
}
