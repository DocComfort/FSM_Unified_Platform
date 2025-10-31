import { describe, expect, it } from "vitest";
import {
  calculateBasicFilterParameters,
  calculateFanLaw,
  evaluateFilterCompatibility,
  type FilterData,
} from "../filter";

describe("filter calculators", () => {
  it("calculates basic filter parameters and warnings", () => {
    const result = calculateBasicFilterParameters({
      systemSizeTons: 3,
      climateZone: "moist",
      filterType: "pleated-basic",
      widthInches: 20,
      heightInches: 20,
    });
    expect(result.totalCfm).toBeCloseTo(1200);
    expect(result.faceVelocity).toBeGreaterThan(350);
    expect(result.warnings).toContain('Face velocity exceeds 350 FPM - consider using a larger filter.');
  });

  it("calculates fan law prediction", () => {
    const result = calculateFanLaw({
      widthInches: 24,
      heightInches: 24,
      ratedAirflowCfm: 1600,
      ratedPressureDrop: 0.2,
      desiredAirflowCfm: 2000,
    });
    expect(result.velocityRatio).toBeCloseTo(1.25);
    expect(result.predictedPressureDrop).toBeCloseTo(0.2 * Math.pow(1.25, 2));
  });

  it("evaluates filter compatibility", () => {
    const filters: FilterData[] = [
      { manufacturer: 'Test', merv_value: '13', model: 'A', size: '20x20', rated_pd: 0.2, rated_airflow: 1500 },
      { manufacturer: 'Test', merv_value: '11', model: 'B', size: '20x20', rated_pd: 0.1, rated_airflow: 1200 },
    ];
    const matches = evaluateFilterCompatibility(filters, 1000, 20, 20);
    expect(matches.length).toBe(2);
    expect(matches[0].estimatedPressure).toBeLessThan(matches[1].estimatedPressure);
  });
});