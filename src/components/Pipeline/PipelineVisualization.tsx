/**
 * PipelineVisualization — The Hero Element
 *
 * Every interaction traverses this five-stage pipeline.
 * This visual proves Claim #1: The pipeline is the invariant.
 *
 * The user watches their input flow through:
 * Telemetry → Recognition → Compilation → Approval → Execution
 */

import { usePipeline } from '../../state/context'
import type { PipelineStage as PipelineStageType } from '../../state/types'
import { PipelineStage, STAGE_META } from './PipelineStage'
import { PipelineConnector } from './PipelineConnector'

const STAGES: PipelineStageType[] = [
  'telemetry',
  'recognition',
  'compilation',
  'approval',
  'execution',
]

export function PipelineVisualization() {
  const pipeline = usePipeline()

  return (
    <section className="border-b border-slate-700 bg-slate-800/50 py-6">
      <div className="flex items-center justify-center">
        {STAGES.map((stage, idx) => (
          <div key={stage} className="flex items-center">
            <PipelineStage
              name={STAGE_META[stage].label}
              state={pipeline.stages[stage]}
              icon={STAGE_META[stage].icon}
            />

            {idx < STAGES.length - 1 && (
              <PipelineConnector
                fromState={pipeline.stages[stage]}
                toState={pipeline.stages[STAGES[idx + 1]]}
              />
            )}
          </div>
        ))}
      </div>

      {/* Halt reason display (Jidoka) */}
      {pipeline.halted && pipeline.haltReason && (
        <div className="mt-4 mx-auto max-w-2xl">
          <div className="bg-red-950/50 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
              <span>🛑</span>
              <span>Pipeline Halted at {STAGE_META[pipeline.haltReason.stage]?.label}</span>
            </div>
            <p className="text-sm text-red-300 mb-2">{pipeline.haltReason.error}</p>
            <div className="text-xs text-slate-400">
              <span className="text-slate-500">Expected: </span>
              {pipeline.haltReason.expected}
            </div>
            <div className="text-xs text-blue-400 mt-2">
              <span className="text-slate-500">Proposed fix: </span>
              {pipeline.haltReason.proposedFix}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
