import { GapInput } from '@gaplab/core';
import { DataState, ProviderResult } from '@gaplab/providers';

/**
 * Generic structure for agent artifacts.  Each agent analyses a specific aspect
 * of the gap and produces a typed result along with confidence and rationale.
 */
export interface AgentArtifact<T> {
  /** Unique identifier for this agent result (e.g. 'catalystAnalyst'). */
  id: string;
  /** Identifier of the entity being analysed (e.g. stock ticker). */
  entityId: string;
  /** Structured result produced by the agent. */
  result: T;
  /** Confidence score between 0 and 1. */
  confidence: number;
  /** Detailed rationale explaining the reasoning. */
  rationale: string;
  /** State of the analysis (OK, LOW_CONFIDENCE, MANUAL_REVIEW, etc.). */
  state: DataState;
}

/** Catalyst analyst examines the catalystQuality field and returns a structured
 * assessment. */
export function catalystAnalyst(input: GapInput): AgentArtifact<{ quality: string }> {
  const quality = input.catalystQuality;
  let confidence = 0.5;
  let rationale = '';
  if (quality === 'HIGH') {
    confidence = 0.9;
    rationale = 'Strong news or earnings catalyst expected to drive conviction.';
  } else if (quality === 'MEDIUM') {
    confidence = 0.6;
    rationale = 'Moderate catalyst; impact uncertain.';
  } else if (quality === 'LOW') {
    confidence = 0.4;
    rationale = 'Weak catalyst; caution warranted.';
  } else {
    confidence = 0.2;
    rationale = 'No obvious catalyst; likely noise.';
  }
  return {
    id: 'catalystAnalyst',
    entityId: input.ticker,
    result: { quality },
    confidence,
    rationale,
    state: confidence > 0.5 ? 'OK' : 'LOW_CONFIDENCE'
  };
}

/** Chart context analyst summarises prior support/resistance and recent base structure. */
export function chartContextAnalyst(input: GapInput): AgentArtifact<{ context: string }> {
  const contextPieces: string[] = [];
  if (input.priorSupportResistance) contextPieces.push(`Support/Resistance: ${input.priorSupportResistance}`);
  if (input.recentBaseStructure) contextPieces.push(`Base: ${input.recentBaseStructure}`);
  const context = contextPieces.join('; ') || 'No significant chart context.';
  const confidence = context === 'No significant chart context.' ? 0.3 : 0.7;
  return {
    id: 'chartContextAnalyst',
    entityId: input.ticker,
    result: { context },
    confidence,
    rationale: context,
    state: confidence > 0.5 ? 'OK' : 'LOW_CONFIDENCE'
  };
}

/** Liquidity analyst evaluates float and liquidityScore to warn about thin stocks. */
export function liquidityAnalyst(input: GapInput): AgentArtifact<{ liquidity: string }> {
  let liquidity: string;
  let confidence = 0.5;
  if (input.liquidityScore > 0.7 && (input.float ?? 0) > 10) {
    liquidity = 'High';
    confidence = 0.9;
  } else if (input.liquidityScore < 0.4 || (input.float ?? 0) < 5) {
    liquidity = 'Low';
    confidence = 0.6;
  } else {
    liquidity = 'Medium';
    confidence = 0.7;
  }
  return {
    id: 'liquidityAnalyst',
    entityId: input.ticker,
    result: { liquidity },
    confidence,
    rationale: `Liquidity is ${liquidity}`,
    state: confidence > 0.5 ? 'OK' : 'LOW_CONFIDENCE'
  };
}

/** Early tape analyst notes the opening drive behaviour. */
export function earlyTapeAnalyst(input: GapInput): AgentArtifact<{ drive: string }> {
  const drive = input.openingDrive ?? 'UNKNOWN';
  const confidence = drive === 'UNKNOWN' ? 0.3 : 0.8;
  return {
    id: 'earlyTapeAnalyst',
    entityId: input.ticker,
    result: { drive },
    confidence,
    rationale: drive === 'UNKNOWN' ? 'No opening tape data yet.' : `Opening drive is ${drive}`,
    state: confidence > 0.5 ? 'OK' : 'LOW_CONFIDENCE'
  };
}

/** Sceptic analyst downgrades confidence if multiple agents disagree.  For v1 it returns a neutral artefact. */
export function scepticAnalyst(input: GapInput): AgentArtifact<{ note: string }> {
  return {
    id: 'scepticAnalyst',
    entityId: input.ticker,
    result: { note: 'Scepticism applied: limited evidence base in v1' },
    confidence: 0.5,
    rationale: 'This version does not have historical memory; remain cautious.',
    state: 'LOW_CONFIDENCE'
  };
}

/** Synthesis lead aggregates previous agent outputs into a summary.  In v1 the synthesis
 * simply collates the rationales. */
export function synthesisLead(
  input: GapInput,
  artefacts: AgentArtifact<any>[]
): AgentArtifact<{ summary: string }> {
  const summary = artefacts.map(a => `${a.id}: ${a.rationale}`).join(' | ');
  const minConfidence = Math.min(...artefacts.map(a => a.confidence));
  return {
    id: 'synthesisLead',
    entityId: input.ticker,
    result: { summary },
    confidence: minConfidence,
    rationale: summary,
    state: minConfidence > 0.5 ? 'OK' : 'LOW_CONFIDENCE'
  };
}

/** Run all analysts on a gap input and return their artefacts. */
export function runAnalysts(input: GapInput): AgentArtifact<any>[] {
  const arts: AgentArtifact<any>[] = [];
  arts.push(catalystAnalyst(input));
  arts.push(chartContextAnalyst(input));
  arts.push(liquidityAnalyst(input));
  arts.push(earlyTapeAnalyst(input));
  arts.push(scepticAnalyst(input));
  // synthesis is not included here; workflows call it separately
  return arts;
}