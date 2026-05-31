import { GapInput } from '@gaplab/core';
/**
 * Loads the raw gap inputs from the fixtures directory.  This function reads a
 * JSON file containing an array of objects and returns them typed as GapInput.
 */
export declare function loadRawGapInputs(): Promise<GapInput[]>;
/**
 * Synchronous version of loadRawGapInputs.  Useful for CLI scripts where
 * asynchronous operations are not desirable.
 */
export declare function loadRawGapInputsSync(): GapInput[];
//# sourceMappingURL=index.d.ts.map