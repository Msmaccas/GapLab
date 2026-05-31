import { classifyGap, GapTemplate } from '@gaplab/core';

describe('classifyGap', () => {
  it('classifies a strong catalyst with high volume as continuation', () => {
    const input = {
      ticker: 'AAPL',
      gapPercent: 6,
      catalystQuality: 'HIGH',
      relativeVolume: 2,
      liquidityScore: 0.8,
      openingDrive: 'UP'
    } as any;
    const result = classifyGap(input);
    expect(result.template).toBe(GapTemplate.CONTINUATION);
  });

  it('classifies a negative gap with low catalyst as fill likely', () => {
    const input = {
      ticker: 'XYZ',
      gapPercent: -4,
      catalystQuality: 'LOW',
      relativeVolume: 1.2,
      liquidityScore: 0.7
    } as any;
    const result = classifyGap(input);
    expect(result.template).toBe(GapTemplate.FILL_LIKELY);
  });
});