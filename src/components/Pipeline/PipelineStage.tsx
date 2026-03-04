/**
 * PipelineStage — Individual stage in the five-stage pipeline
 *
 * States:
 * - idle: Gray, waiting
 * - active: Blue, pulsing — currently processing
 * - complete: Green — done
 * - error: Red, shaking — halted (Jidoka)
 */

import type { StageState } from '../../state/types'

interface PipelineStageProps {
  name: string
  state: StageState
  icon: string
}

const STATE_STYLES: Record<StageState, string> = {
  idle: 'bg-slate-700/80 text-slate-400 border-slate-600',
  active: 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/25',
  complete: 'bg-green-600 text-white border-green-400',
  error: 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-500/25',
}

const STATE_ANIMATIONS: Record<StageState, string> = {
  idle: '',
  active: 'animate-pulse',
  complete: '',
  error: 'animate-[shake_0.5s_ease-in-out]',
}

export function PipelineStage({ name, state, icon }: PipelineStageProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        w-28 h-20 rounded-xl border-2
        transition-all duration-300 ease-out
        ${STATE_STYLES[state]}
        ${STATE_ANIMATIONS[state]}
      `}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-xs font-medium tracking-wide uppercase">
        {name}
      </span>
    </div>
  )
}

// Stage metadata — icons and labels for each stage
export const STAGE_META: Record<string, { icon: string; label: string }> = {
  telemetry: { icon: '📡', label: 'Telemetry' },
  recognition: { icon: '🔍', label: 'Recognition' },
  compilation: { icon: '⚙️', label: 'Compilation' },
  approval: { icon: '✋', label: 'Approval' },
  execution: { icon: '⚡', label: 'Execution' },
}
