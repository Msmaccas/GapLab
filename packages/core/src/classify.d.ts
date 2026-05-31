import { GapInput, Classification } from './types';
/**
 * Simple deterministic classifier for gapping stocks.
 *
 * The classification heuristics are intentionally transparent.  They should be
 * replaced with more sophisticated rules once sufficient evidence is gathered.
 *
 * @param input gap attributes
 */
export declare function classifyGap(input: GapInput): Classification;
//# sourceMappingURL=classify.d.ts.map