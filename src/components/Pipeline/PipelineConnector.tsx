/**
 * PipelineConnector — Arrow between pipeline stages
 *
 * Shows flow direction and animates when data is moving through.
 */

import type { StageState } from '../../state/types'

interface PipelineConnectorProps {
  fromState: StageState
  toState: StageState
}

export function PipelineConnector({ fromState, toState }: PipelineConnectorProps) {
  // Connector is "active" when data is flowing through it
  // (previous stage complete, next stage active or complete)
  const isActive = fromState === 'complete' && (toState === 'active' || toState === 'complete')
  const isComplete = fromState === 'complete' && toState === 'complete'

  return (
    <div className="flex items-center mx-2">
      <div
        className={`
          w-8 h-0.5 rounded-full transition-all duration-300
          ${isComplete ? 'bg-green-500' : ''}
          ${isActive && !isComplete ? 'bg-blue-500' : ''}
          ${!isActive && !isComplete ? 'bg-slate-600' : ''}
        `}
      />
      <div
        className={`
          w-0 h-0 border-t-[5px] border-b-[5px] border-l-[6px]
          border-t-transparent border-b-transparent
          transition-all duration-300
          ${isComplete ? 'border-l-green-500' : ''}
          ${isActive && !isComplete ? 'border-l-blue-500' : ''}
          ${!isActive && !isComplete ? 'border-l-slate-600' : ''}
        `}
      />
    </div>
  )
}
