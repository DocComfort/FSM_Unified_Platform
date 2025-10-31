export type InsulationLevel = 'poor' | 'average' | 'good' | 'excellent';
export type WindowEfficiency = 'single-pane' | 'double-pane' | 'low-e';
export type InfiltrationTightness = 'loose' | 'average' | 'tight';
export type ClimateProfile = 'very-cold' | 'cold' | 'mixed' | 'hot-humid' | 'hot-dry';
export type SolarShading = 'none' | 'partial' | 'full';

export interface ManualJInput {
  squareFootage: number;
  ceilingHeight: number;
  insulation: InsulationLevel;
  windowEfficiency: WindowEfficiency;
  infiltration: InfiltrationTightness;
  climate: ClimateProfile;
  shading: SolarShading;
  occupants: number;
  designCoolingDeltaT?: number;
  designHeatingDeltaT?: number;
  ventilationCfm?: number;
  runtimeFactor?: number;
}

export interface ManualJResult {
  coolingLoadBtuh: number;
  sensibleCoolingBtuh: number;
  latentCoolingBtuh: number;
  sensibleHeatRatio: number;
  heatingLoadBtuh: number;
  recommendedTonnage: number;
  recommendedAirflowCfm: number;
  infiltrationCfm: number;
  ventilationCfm: number;
  warnings: string[];
}

const COOLING_FACTORS: Record<InsulationLevel, number> = {
  poor: 38,
  average: 32,
  good: 27,
  excellent: 23,
};

const HEATING_FACTORS: Record<InsulationLevel, number> = {
  poor: 52,
  average: 42,
  good: 34,
  excellent: 28,
};

const CLIMATE_MULTIPLIERS: Record<ClimateProfile, { cooling: number; heating: number }> = {
  'very-cold': { cooling: 0.85, heating: 1.25 },
  cold: { cooling: 0.9, heating: 1.1 },
  mixed: { cooling: 1, heating: 1 },
  'hot-humid': { cooling: 1.2, heating: 0.95 },
  'hot-dry': { cooling: 1.05, heating: 0.9 },
};

const WINDOW_MULTIPLIERS: Record<WindowEfficiency, number> = {
  'single-pane': 1.15,
  'double-pane': 1,
  'low-e': 0.9,
};

const SHADING_MULTIPLIERS: Record<SolarShading, number> = {
  none: 1.12,
  partial: 1,
  full: 0.9,
};

const INFILTRATION_ACH: Record<InfiltrationTightness, number> = {
  loose: 0.8,
  average: 0.5,
  tight: 0.35,
};

const LATENT_DELTA_GRAINS: Record<ClimateProfile, number> = {
  'very-cold': 6,
  cold: 10,
  mixed: 18,
  'hot-humid': 30,
  'hot-dry': 12,
};

const DEFAULT_COOLING_DT = 20;
const DEFAULT_HEATING_DT = 70;
const DEFAULT_RUNTIME_FACTOR = 0.85;
const OCCUPANT_SENSIBLE = 230;
const OCCUPANT_LATENT = 200;
const TON_BTUS = 12000;

function calculateInfiltrationCfm(
  squareFootage: number,
  ceilingHeight: number,
  tightness: InfiltrationTightness
): number {
  const volume = squareFootage * ceilingHeight;
  const ach = INFILTRATION_ACH[tightness];
  return (volume * ach) / 60;
}

function calculateVentilationCfm(ventilationCfm: number | undefined, occupants: number): number {
  const minimumVentilation = occupants > 0 ? occupants * 15 : 0;
  return Math.max(ventilationCfm ?? 0, minimumVentilation);
}

export function calculateManualJ(input: ManualJInput): ManualJResult | null {
  const {
    squareFootage,
    ceilingHeight,
    insulation,
    windowEfficiency,
    infiltration,
    climate,
    shading,
    occupants,
    designCoolingDeltaT = DEFAULT_COOLING_DT,
    designHeatingDeltaT = DEFAULT_HEATING_DT,
    ventilationCfm,
    runtimeFactor = DEFAULT_RUNTIME_FACTOR,
  } = input;

  if (
    !Number.isFinite(squareFootage) ||
    !Number.isFinite(ceilingHeight) ||
    squareFootage <= 0 ||
    ceilingHeight <= 0 ||
    occupants < 0
  ) {
    return null;
  }

  const climateAdjust = CLIMATE_MULTIPLIERS[climate];
  const windowAdjust = WINDOW_MULTIPLIERS[windowEfficiency];
  const shadingAdjust = SHADING_MULTIPLIERS[shading];

  const envelopeCooling =
    squareFootage * COOLING_FACTORS[insulation] * climateAdjust.cooling * windowAdjust * shadingAdjust;
  const envelopeHeating = squareFootage * HEATING_FACTORS[insulation] * climateAdjust.heating * windowAdjust;

  const infiltrationCfm = calculateInfiltrationCfm(squareFootage, ceilingHeight, infiltration);
  const latentDelta = LATENT_DELTA_GRAINS[climate];
  const infiltrationSensibleCooling = 1.1 * infiltrationCfm * designCoolingDeltaT;
  const infiltrationLatentCooling = 0.68 * infiltrationCfm * latentDelta;
  const infiltrationHeating = 1.1 * infiltrationCfm * designHeatingDeltaT;

  const mechanicalVentilationCfm = calculateVentilationCfm(ventilationCfm, occupants);
  const ventilationSensibleCooling = 1.1 * mechanicalVentilationCfm * designCoolingDeltaT;
  const ventilationLatentCooling = 0.68 * mechanicalVentilationCfm * latentDelta;
  const ventilationHeating = 1.1 * mechanicalVentilationCfm * designHeatingDeltaT;

  const occupantSensible = occupants * OCCUPANT_SENSIBLE;
  const occupantLatent = occupants * OCCUPANT_LATENT;

  const sensibleCoolingRaw =
    envelopeCooling +
    infiltrationSensibleCooling +
    ventilationSensibleCooling +
    occupantSensible * runtimeFactor;
  const latentCoolingRaw = infiltrationLatentCooling + ventilationLatentCooling + occupantLatent * runtimeFactor;

  const sensibleCoolingBtuh = Math.round(sensibleCoolingRaw);
  const latentCoolingBtuh = Math.round(latentCoolingRaw);
  const coolingLoadBtuh = sensibleCoolingBtuh + latentCoolingBtuh;
  const sensibleHeatRatio = coolingLoadBtuh > 0 ? sensibleCoolingBtuh / coolingLoadBtuh : 0;

  const occupantHeatingOffset = occupantSensible * runtimeFactor;
  const heatingLoadBtuh = Math.max(
    0,
    Math.round(envelopeHeating + infiltrationHeating + ventilationHeating - occupantHeatingOffset)
  );

  const recommendedTonnage = Math.max(coolingLoadBtuh / TON_BTUS, 0);
  const coolingAirflowFromLoad = designCoolingDeltaT > 0 ? sensibleCoolingRaw / (1.1 * designCoolingDeltaT) : 0;
  const recommendedAirflowCfm = Math.max(coolingAirflowFromLoad, recommendedTonnage * 400);
  const airflowPerTon = recommendedTonnage > 0 ? recommendedAirflowCfm / recommendedTonnage : 0;
  const infiltrationPerSqft = squareFootage > 0 ? infiltrationCfm / squareFootage : 0;

  const warnings: string[] = [];
  if (recommendedTonnage > 5) {
    warnings.push('Calculated load exceeds 5 tons; consider multiple systems or staged equipment.');
  }
  if (sensibleHeatRatio < 0.7) {
    warnings.push('Low sensible heat ratio detected; verify latent loads and consider dehumidification strategies.');
  }
  if (recommendedTonnage > 0 && coolingAirflowFromLoad > recommendedTonnage * 450) {
    warnings.push('Recommended airflow is above 450 CFM per ton; confirm duct design can support the volume.');
  }
  if (recommendedTonnage > 0 && coolingAirflowFromLoad < recommendedTonnage * 350) {
    warnings.push('Sensible load suggests airflow under 350 CFM per ton; verify delta-T and duct assumptions.');
  }
  if (airflowPerTon > 475) {
    warnings.push('Calculated supply airflow exceeds 475 CFM per ton; review fan settings and duct sizing.');
  }
  if (infiltrationPerSqft > 0.15) {
    warnings.push('Infiltration load is high relative to envelope size; investigate air sealing opportunities.');
  }

  return {
    coolingLoadBtuh,
    sensibleCoolingBtuh,
    latentCoolingBtuh,
    sensibleHeatRatio,
    heatingLoadBtuh,
    recommendedTonnage,
    recommendedAirflowCfm: Math.round(recommendedAirflowCfm),
    infiltrationCfm: Math.round(infiltrationCfm),
    ventilationCfm: Math.round(mechanicalVentilationCfm),
    warnings,
  };
}
