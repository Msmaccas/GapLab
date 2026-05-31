import { GapWorkflowOutput } from '@gaplab/workflows';

/**
 * Generate a simple markdown report summarising a list of gap workflow outputs.
 * The report contains a table of key fields followed by detailed rationales for
 * each ticker.  This function is deterministic given the same inputs.
 */
export function generateMarkdownReport(outputs: GapWorkflowOutput[]): string {
  const lines: string[] = [];
  lines.push('# GapLab Morning Board');
  lines.push('');
  lines.push('| Ticker | Gap % | Template | Catalyst | Liquidity |');
  lines.push('|-------|------:|----------|----------|-----------|');
  for (const o of outputs) {
    const { input, classification } = o;
    lines.push(`| ${input.ticker} | ${input.gapPercent.toFixed(2)} | ${classification.template} | ${input.catalystQuality} | ${input.liquidityScore.toFixed(2)} |`);
  }
  lines.push('');
  lines.push('## Details');
  for (const o of outputs) {
    lines.push(`### ${o.input.ticker}`);
    lines.push(`* **Classification:** ${o.classification.template}`);
    lines.push(`* **Reasons:** ${o.classification.reasons.join('; ') || 'No specific reasons'}`);
    lines.push(`* **Analyst Summary:** ${o.synthesis.result.summary}`);
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * Generate a JSON board suitable for API responses.  Only whitelisted fields
 * from the workflow outputs are included to avoid leaking internal rationale.
 */
export function generateBoardJson(outputs: GapWorkflowOutput[]): any {
  return outputs.map(o => {
    // Derive a simple confidence metric based on number of reasons. More
    // sophisticated models could incorporate analyst confidence scores.
    const reasonCount = o.classification.reasons.length;
    let confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    if (reasonCount >= 3) {
      confidence = 'HIGH';
    } else if (reasonCount === 2) {
      confidence = 'MEDIUM';
    } else {
      confidence = 'LOW';
    }
    return {
      ticker: o.input.ticker,
      gapPercent: o.input.gapPercent,
      template: o.classification.template,
      reasons: o.classification.reasons,
      catalystQuality: o.input.catalystQuality,
      liquidityScore: o.input.liquidityScore,
      confidence,
      rationale: o.synthesis.result.summary
    };
  });
}