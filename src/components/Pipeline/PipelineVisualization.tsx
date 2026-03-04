/**
 * PipelineVisualization — The Hero Element
 *
 * Every interaction traverses this five-stage pipeline.
 * This visual proves Claim #1: The pipeline is the invariant.
 *
 * The user watches their input flow through:
 * Telemetry → Recognition → Compilation → Approval → Execution
 *
 * Design: Strict geometry (no rounded), grove amber active state
 *
 * v0.4.1: Halt reason display moved inline to InteractionCard (DiagnosticCard)
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
    <section className="border-b border-grove-border bg-grove-bg2 py-6">
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
    </section>
  )
}
