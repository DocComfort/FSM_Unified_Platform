import { describe, expect, it } from "vitest";
import { calculateDuctSizing } from "../duct";

describe("calculateDuctSizing", () => {
  it("computes round and rectangular sizing with warnings", () => {
    const result = calculateDuctSizing({
      airflowCfm: 1200,
      straightLengthFeet: 50,
      totalStaticPressure: 0.5,
      fittings: [
        { equivalentLength: 10, quantity: 2 },
        { equivalentLength: 5, quantity: 1 },
      ],
      components: [
        { enabled: true, pressureLoss: 0.1 },
        { enabled: true, pressureLoss: 0.05 },
      ],
      desiredWidthInches: 16,
    });

    expect(result).not.toBeNull();
    expect(result?.equivalentLength).toBeCloseTo(75, 5);
    expect(result?.availableStaticPressure).toBeCloseTo(0.35, 5);
    expect(result?.round.diameter).toBeGreaterThan(10);
    expect(result?.rectangular.width).toBe(16);
    expect(result?.warnings.length).toBeGreaterThan(0);
  });

  it("returns null for invalid inputs", () => {
    const result = calculateDuctSizing({
      airflowCfm: -1,
      straightLengthFeet: 10,
      totalStaticPressure: 0.5,
    });
    expect(result).toBeNull();
  });
});