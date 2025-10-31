import { describe, expect, it } from 'vitest';

import { calculateManualJ } from '../manualJ';

describe('calculateManualJ', () => {
  it('calculates balanced loads for a typical mixed-humid home', () => {
    const result = calculateManualJ({
      squareFootage: 2200,
      ceilingHeight: 8,
      insulation: 'average',
      windowEfficiency: 'double-pane',
      infiltration: 'average',
      climate: 'hot-humid',
      shading: 'partial',
      occupants: 4,
    });

    expect(result).not.toBeNull();
    expect(result!.coolingLoadBtuh).toBeGreaterThan(42000);
    expect(result!.coolingLoadBtuh).toBeLessThan(70000);
    expect(result!.heatingLoadBtuh).toBeGreaterThan(40000);
    expect(result!.recommendedTonnage).toBeGreaterThan(3);
    expect(result!.recommendedTonnage).toBeLessThan(6);
    expect(result!.recommendedAirflowCfm).toBeGreaterThan(1400);
    expect(result!.sensibleHeatRatio).toBeGreaterThan(0.7);
    expect(result!.ventilationCfm).toBe(60);
  });

  it('returns null for invalid geometry inputs', () => {
    expect(
      calculateManualJ({
        squareFootage: 0,
        ceilingHeight: 8,
        insulation: 'average',
        windowEfficiency: 'double-pane',
        infiltration: 'average',
        climate: 'mixed',
        shading: 'partial',
        occupants: 2,
      })
    ).toBeNull();
    expect(
      calculateManualJ({
        squareFootage: 1800,
        ceilingHeight: -1,
        insulation: 'average',
        windowEfficiency: 'double-pane',
        infiltration: 'average',
        climate: 'mixed',
        shading: 'partial',
        occupants: 2,
      })
    ).toBeNull();
  });

  it('flags infiltration and airflow edge cases', () => {
    const result = calculateManualJ({
      squareFootage: 1500,
      ceilingHeight: 9,
      insulation: 'poor',
      windowEfficiency: 'single-pane',
      infiltration: 'loose',
      climate: 'very-cold',
      shading: 'none',
      occupants: 2,
      runtimeFactor: 1,
    });

    expect(result).not.toBeNull();
    expect(result!.coolingLoadBtuh).toBeGreaterThan(30000);
    expect(result!.warnings.some((warning) => warning.includes('Infiltration load is high'))).toBe(true);
    expect(
      result!.warnings.some((warning) =>
        warning.includes('Recommended airflow is above 450 CFM per ton')
      )
    ).toBe(true);
  });
});
