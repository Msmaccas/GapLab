import { GapInput, GapTemplate, Classification } from './types';

/**
 * Simple deterministic classifier for gapping stocks.
 *
 * The classification heuristics are intentionally transparent.  They should be
 * replaced with more sophisticated rules once sufficient evidence is gathered.
 *
 * @param input gap attributes
 */
export function classifyGap(input: GapInput): Classification {
  const reasons: string[] = [];
  // Default classification
  let template: GapTemplate = GapTemplate.MONITOR_ONLY;

  // Basic catalyst quality and gap direction heuristics
  if (input.catalystQuality === 'HIGH' && input.gapPercent > 0) {
    if (input.liquidityScore > 0.5 && input.relativeVolume > 1) {
      template = GapTemplate.CONTINUATION;
      reasons.push('High-quality catalyst with positive gap and strong liquidity');
    } else {
      template = GapTemplate.MONITOR_ONLY;
      reasons.push('High-quality catalyst but liquidity/volume weak');
    }
  }

  // Trap likely: low-quality catalyst and positive gap may trap long-biased traders
  if (input.catalystQuality === 'LOW' && input.gapPercent > 0) {
    template = GapTemplate.TRAP_LIKELY;
    reasons.push('Low-quality catalyst despite positive gap – prone to traps');
  }

  // Fill likely: negative gap with decent liquidity often retraces part of the move
  if (input.gapPercent < 0 && input.liquidityScore > 0.4) {
    template = GapTemplate.FILL_LIKELY;
    reasons.push('Negative gap with sufficient liquidity – fills are common');
  }

  // Noisy low-quality: low catalyst quality and low relative volume
  if (input.catalystQuality === 'NONE' || input.relativeVolume < 0.5) {
    template = GapTemplate.NOISY_LOW_QUALITY;
    reasons.push('No catalyst or very low relative volume – likely noise');
  }

  // Opening drive adjustments: if early tape is strong against initial classification
  if (input.openingDrive === 'UP' && template === GapTemplate.FILL_LIKELY) {
    template = GapTemplate.MONITOR_ONLY;
    reasons.push('Opening drive contradicts fill expectation – monitor');
  }
  if (input.openingDrive === 'DOWN' && template === GapTemplate.CONTINUATION) {
    template = GapTemplate.MONITOR_ONLY;
    reasons.push('Opening drive down despite positive catalyst – caution');
  }

  return { template, reasons };
}