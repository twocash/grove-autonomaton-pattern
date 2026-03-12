/**
 * PipelineStage — Individual stage in the five-stage pipeline
 *
 * States:
 * - idle: Dark gray, waiting
 * - active: Grove amber, pulsing — currently processing
 * - complete: Grove green — done
 * - error: Grove red, shaking — halted (Jidoka)
 *
 * Design: Strict geometry (no rounded), font-mono for labels
 */

import type { StageState } from '../../state/types'

interface PipelineStageProps {
  name: string
  state: StageState
  icon: string
}

const STATE_STYLES: Record<StageState, string> = {
  idle: 'bg-grove-border text-grove-text-dim border-grove-border',
  active: 'bg-grove-amber text-white border-grove-amber shadow-lg shadow-grove-amber/25',
  complete: 'bg-grove-green text-white border-grove-green',
  error: 'bg-grove-red text-white border-grove-red shadow-lg shadow-grove-red/25',
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
        flex items-center gap-2 px-3 py-1.5 border
        font-mono text-xs tracking-widest uppercase
        transition-all duration-300 ease-out
        ${STATE_STYLES[state]}
        ${STATE_ANIMATIONS[state]}
      `}
    >
      <span className="text-grove-text-dim">{icon}</span>
      <span className="font-medium">{name}</span>
    </div>
  )
}

// Stage metadata — numbers and labels for each stage
export const STAGE_META: Record<string, { icon: string; label: string }> = {
  telemetry: { icon: '01', label: 'Telemetry' },
  recognition: { icon: '02', label: 'Recognition' },
  compilation: { icon: '03', label: 'Compilation' },
  approval: { icon: '04', label: 'Approval' },
  execution: { icon: '05', label: 'Execution' },
}
