import fs from 'fs/promises';
import path from 'path';
import { GapInput } from '@gaplab/core';

/**
 * Loads the raw gap inputs from the fixtures directory.  This function reads a
 * JSON file containing an array of objects and returns them typed as GapInput.
 */
export async function loadRawGapInputs(): Promise<GapInput[]> {
  const filePath = path.resolve(__dirname, '../../../fixtures/raw/gaps.json');
  const content = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(content) as GapInput[];
  return parsed;
}

/**
 * Synchronous version of loadRawGapInputs.  Useful for CLI scripts where
 * asynchronous operations are not desirable.
 */
export function loadRawGapInputsSync(): GapInput[] {
  const filePath = path.resolve(__dirname, '../../../fixtures/raw/gaps.json');
  const content = require('fs').readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as GapInput[];
}