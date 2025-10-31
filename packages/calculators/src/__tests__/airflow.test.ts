import { describe, expect, it } from "vitest";
import { predictAirflowStaticPressure } from "../airflow";

describe("predictAirflowStaticPressure", () => {
  it("returns predictions across range", () => {
    const results = predictAirflowStaticPressure(1000, 0.2, 0.1, { minCfm: 1000, maxCfm: 1200, step: 100 });
    expect(results).toHaveLength(3);
    expect(results[0]).toMatchObject({ newCfm: 1000 });
    // fan affinity: ratio 1.1 -> pressures times 1.21
    expect(results[2].predictedTotalSp).toBeCloseTo((0.2 + 0.1) * Math.pow(1.2, 2));
  });

  it("guards against invalid input", () => {
    const results = predictAirflowStaticPressure(0, 0.2, 0.1);
    expect(results).toEqual([]);
  });
});