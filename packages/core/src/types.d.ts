export declare enum GapTemplate {
    CONTINUATION = "CONTINUATION",
    FILL_LIKELY = "FILL_LIKELY",
    TRAP_LIKELY = "TRAP_LIKELY",
    NOISY_LOW_QUALITY = "NOISY_LOW_QUALITY",
    MONITOR_ONLY = "MONITOR_ONLY"
}
/**
 * Raw attributes about a gapping stock captured before the open.
 * Fields should be as explicit as possible to avoid implicit assumptions.
 */
export interface GapInput {
    /** The stock ticker (symbol). */
    ticker: string;
    /** Gap size in percent (e.g. 5 for +5 %). */
    gapPercent: number;
    /** Qualitative assessment of the catalyst (earnings, news, etc.). */
    catalystQuality: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    /** Relative volume versus average daily volume (1 = average). */
    relativeVolume: number;
    /** Liquidity score between 0 and 1 (higher means more liquid). */
    liquidityScore: number;
    /** Optional float in millions of shares (smaller floats may behave differently). */
    float?: number;
    /** Prior support or resistance description. */
    priorSupportResistance?: string;
    /** Recent base structure description. */
    recentBaseStructure?: string;
    /** Early opening drive observation: up, down or sideways. */
    openingDrive?: 'UP' | 'DOWN' | 'SIDEWAYS' | 'UNKNOWN';
}
export interface Classification {
    template: GapTemplate;
    reasons: string[];
}
//# sourceMappingURL=types.d.ts.map