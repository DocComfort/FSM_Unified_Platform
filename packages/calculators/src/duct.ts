export interface DuctFitting {
  equivalentLength: number;
  quantity: number;
}

export interface DuctComponent {
  enabled: boolean;
  pressureLoss: number;
}

export interface RectangularSizing {
  width: number;
  height: number;
  velocity: number;
  frictionRate: number;
  aspectRatio: number;
}

export interface RoundSizing {
  diameter: number;
  velocity: number;
  frictionRate: number;
}

export interface DuctSizingResult {
  round: RoundSizing;
  rectangular: RectangularSizing;
  availableStaticPressure: number;
  equivalentLength: number;
  warnings: string[];
}

export interface DuctSizingInput {
  airflowCfm: number;
  straightLengthFeet: number;
  totalStaticPressure: number;
  fittings?: DuctFitting[];
  components?: DuctComponent[];
  targetVelocityFpm?: number;
  desiredWidthInches?: number;
}

const DEFAULT_TARGET_VELOCITY = 900;
const MAX_FRICTION_RATE = 0.15; // in. w.c. per 100 ft
const MAX_VELOCITY = 1200; // FPM
const MAX_ASPECT_RATIO = 4;

export function calculateEquivalentLength(straightLengthFeet: number, fittings: DuctFitting[] = []): number {
  const straight = Math.max(straightLengthFeet, 0);
  const fittingsLength = fittings.reduce((total, fitting) => {
    const qty = Math.max(fitting.quantity, 0);
    return total + fitting.equivalentLength * qty;
  }, 0);
  return straight + fittingsLength;
}

export function calculateAvailableStaticPressure(totalStaticPressure: number, components: DuctComponent[] = []): number {
  const losses = components
    .filter((component) => component.enabled)
    .reduce((sum, component) => sum + component.pressureLoss, 0);
  return totalStaticPressure - losses;
}

function sizeRoundDuct(cfm: number, targetVelocity: number, frictionRate: number): RoundSizing {
  const areaSqFt = cfm / targetVelocity;
  const diameterFeet = Math.sqrt((4 * areaSqFt) / Math.PI);
  const diameterInches = Math.ceil(diameterFeet * 12);
  const actualVelocity = cfm / (Math.PI * Math.pow(diameterInches / 24, 2));

  return {
    diameter: diameterInches,
    velocity: actualVelocity,
    frictionRate,
  };
}

function sizeRectangularDuct(
  cfm: number,
  widthInches: number,
  targetVelocity: number,
  frictionRate: number
): RectangularSizing {
  const width = Math.max(widthInches, 4);
  const areaSqFt = cfm / targetVelocity;
  const heightFeet = areaSqFt / (width / 12);
  const heightInches = Math.ceil(heightFeet * 12);
  const velocity = cfm / (width * heightInches / 144);
  const aspectRatio = Math.max(width, heightInches) / Math.min(width, heightInches);

  return {
    width,
    height: heightInches,
    velocity,
    frictionRate,
    aspectRatio,
  };
}

export function calculateDuctSizing(input: DuctSizingInput): DuctSizingResult | null {
  const {
    airflowCfm,
    straightLengthFeet,
    totalStaticPressure,
    fittings = [],
    components = [],
    targetVelocityFpm = DEFAULT_TARGET_VELOCITY,
    desiredWidthInches,
  } = input;

  if (airflowCfm <= 0 || straightLengthFeet < 0 || totalStaticPressure <= 0) {
    return null;
  }

  const equivalentLength = calculateEquivalentLength(straightLengthFeet, fittings);
  if (equivalentLength <= 0) {
    return null;
  }

  const availableStatic = calculateAvailableStaticPressure(totalStaticPressure, components);
  const frictionRate = (availableStatic * 100) / equivalentLength;

  const round = sizeRoundDuct(airflowCfm, targetVelocityFpm, frictionRate);
  const rectangular = sizeRectangularDuct(
    airflowCfm,
    desiredWidthInches ?? round.diameter,
    targetVelocityFpm,
    frictionRate
  );

  const warnings: string[] = [];
  if (frictionRate > MAX_FRICTION_RATE) {
    warnings.push('Friction rate exceeds recommended maximum of 0.15 in. w.c. per 100 ft.');
  }
  if (round.velocity > MAX_VELOCITY) {
    warnings.push('Round duct velocity exceeds recommended maximum of 1200 FPM.');
  }
  if (rectangular.velocity > MAX_VELOCITY) {
    warnings.push('Rectangular duct velocity exceeds recommended maximum of 1200 FPM.');
  }
  if (rectangular.aspectRatio > MAX_ASPECT_RATIO) {
    warnings.push('Rectangular duct aspect ratio exceeds recommended maximum of 4:1.');
  }

  return {
    round,
    rectangular,
    availableStaticPressure: availableStatic,
    equivalentLength,
    warnings,
  };
}