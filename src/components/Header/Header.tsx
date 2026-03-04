/**
 * Header — Mode toggle, Model Config, Andon Cord
 */

import { useAppState, useAppDispatch } from '../../state/context'
import type { FailureType } from '../../state/types'

export function Header() {
  const { mode, simulateFailure } = useAppState()
  const dispatch = useAppDispatch()

  const handleModeToggle = () => {
    dispatch({ type: 'SET_MODE', mode: mode === 'demo' ? 'interactive' : 'demo' })
  }

  const handleFailureToggle = (failureType: FailureType) => {
    dispatch({ type: 'SET_FAILURE_SIMULATION', failureType })
  }

  return (
    <header className="border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <h1 className="text-xl font-semibold text-white">
            Grove Autonomaton
          </h1>
          <p className="text-sm text-slate-400">Pattern Playground</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Andon Cord - Pull to simulate failure */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Andon:</span>
            <select
              value={simulateFailure}
              onChange={(e) => handleFailureToggle(e.target.value as FailureType)}
              className={`
                text-sm px-3 py-1 rounded border
                ${simulateFailure !== 'none'
                  ? 'bg-red-950 border-red-500 text-red-300'
                  : 'bg-slate-800 border-slate-600 text-slate-300'
                }
              `}
            >
              <option value="none">Normal</option>
              <option value="api_timeout">🔴 API Timeout</option>
              <option value="low_confidence">🔴 Low Confidence</option>
              <option value="hallucination_detected">🔴 Hallucination</option>
            </select>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Mode:</span>
            <button
              onClick={handleModeToggle}
              className={`
                px-3 py-1 rounded text-sm font-medium transition-colors
                ${mode === 'demo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
                }
              `}
            >
              {mode === 'demo' ? 'Demo' : 'Interactive'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
