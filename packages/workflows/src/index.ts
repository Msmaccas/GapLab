import { GapInput, Classification } from '@gaplab/core';
import { classifyGap } from '@gaplab/core';
import { AgentArtifact, runAnalysts, synthesisLead } from '@gaplab/agents';

export interface GapWorkflowOutput {
  input: GapInput;
  classification: Classification;
  artefacts: AgentArtifact<any>[];
  synthesis: AgentArtifact<{ summary: string }>;
}

/**
 * Runs the full gap workflow for a single input.  It will run all analysts,
 * classify the gap, synthesise the analyst outputs, and return a structured
 * object.  The workflow is deterministic given the same input.
 */
export function runGapWorkflow(input: GapInput): GapWorkflowOutput {
  // Run the analysts
  const artefacts = runAnalysts(input);
  // Classify the gap using core heuristics
  const classification = classifyGap(input);
  // Synthesise the analyst rationales
  const synth = synthesisLead(input, artefacts);
  return {
    input,
    classification,
    artefacts,
    synthesis: synth
  };
}

/**
 * Run workflow for multiple inputs.
 */
export function runGapWorkflowBatch(inputs: GapInput[]): GapWorkflowOutput[] {
  return inputs.map(runGapWorkflow);
}