/**
 * TelemetryStream — Real-time audit trail
 *
 * This proves Claim #7: Transparency by construction.
 * Every routing decision is a traced artifact.
 *
 * Features:
 * - Live JSON stream of every interaction
 * - Click entry → highlights corresponding interaction
 * - Export audit log as JSON
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
    <section className="h-48 border-t border-slate-700 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
        <span className="text-sm font-medium text-slate-400">
          Telemetry Stream
          {telemetry.length > 0 && (
            <span className="ml-2 text-xs text-slate-500">
              ({telemetry.length} entries)
            </span>
          )}
        </span>
        <button
          onClick={handleExport}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Export Audit Log
        </button>
      </div>

      {/* Stream */}
      <div className="flex-1 p-2 overflow-y-auto scrollbar-thin font-mono text-xs">
        {telemetry.length === 0 ? (
          <div className="text-slate-600 p-2">
            <p>// Telemetry entries will appear here...</p>
            <p>// Each interaction generates a structured audit record</p>
            <p>// Click any entry to highlight the corresponding interaction</p>
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
                <span className="text-slate-500">{entry.timestamp.slice(11, 19)}</span>
                <span className="text-slate-400"> │ </span>
                <span className="text-blue-400">{entry.intent}</span>
                <span className="text-slate-400"> │ </span>
                <span className={`tier-${entry.tier}`}>T{entry.tier}</span>
                <span className="text-slate-400"> │ </span>
                <span className={`zone-${entry.zone}`}>{entry.zone}</span>
                <span className="text-slate-400"> │ </span>
                <span className="text-slate-300">${entry.cost.toFixed(4)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
