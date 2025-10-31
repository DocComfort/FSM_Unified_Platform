export interface BasicFilterInput {
  systemSizeTons: number;
  climateZone: 'hot-humid' | 'moist' | 'dry' | 'marine';
  filterType: 'fiberglass' | 'pleated-basic' | 'pleated-better' | 'pleated-best';
  widthInches: number;
  heightInches: number;
}

export interface BasicFilterResult {
  totalCfm: number;
  filterArea: number;
  faceVelocity: number;
  initialPressureDrop: number;
  maxPressureDrop: number;
  warnings: string[];
}

export interface FanLawInput {
  widthInches: number;
  heightInches: number;
  ratedAirflowCfm: number;
  ratedPressureDrop: number;
  desiredAirflowCfm: number;
}

export interface FanLawResult {
  faceVelocity: number;
  velocityRatio: number;
  pressureRatio: number;
  predictedPressureDrop: number;
  warnings: string[];
}

export interface FilterData {
  manufacturer: string;
  merv_value: string;
  model: string;
  size?: string;
  rated_fpm?: number;
  rated_pd?: number;
  rated_airflow?: number;
}

export type CompatibilityStatus = 'good' | 'warning' | 'critical';

export interface FilterCompatibilityResult extends FilterData {
  estimatedPressure: number;
  velocityRatio: number;
  status: CompatibilityStatus;
}

const CLIMATE_ZONES = {
  'hot-humid': { cfmPerTon: 350 },
  moist: { cfmPerTon: 400 },
  dry: { cfmPerTon: 450 },
  marine: { cfmPerTon: 400 },
} as const;

const FILTER_TYPES = {
  fiberglass: {
    initialPressureDrops: { 300: 0.05, 350: 0.08, 400: 0.12 },
  },
  'pleated-basic': {
    initialPressureDrops: { 300: 0.08, 350: 0.12, 400: 0.15 },
  },
  'pleated-better': {
    initialPressureDrops: { 300: 0.15, 350: 0.18, 400: 0.22 },
  },
  'pleated-best': {
    initialPressureDrops: { 300: 0.2, 350: 0.25, 400: 0.3 },
  },
} as const;

const MAX_FACE_VELOCITY = 350;

export function calculateBasicFilterParameters(input: BasicFilterInput): BasicFilterResult {
  const { systemSizeTons, climateZone, filterType, widthInches, heightInches } = input;

  const warnings: string[] = [];
  if (widthInches > 48 || heightInches > 48) {
    warnings.push('Filter dimensions seem unusually large.');
  }
  if (widthInches < 4 || heightInches < 4) {
    warnings.push('Filter dimensions seem unusually small.');
  }

  const zoneConfig = CLIMATE_ZONES[climateZone];
  const totalCfm = systemSizeTons * zoneConfig.cfmPerTon;
  const filterArea = (widthInches * heightInches) / 144;
  const faceVelocity = filterArea > 0 ? totalCfm / filterArea : 0;

  const filterConfig = FILTER_TYPES[filterType];
  let initialPressureDrop = filterConfig.initialPressureDrops[400];
  if (faceVelocity <= 300) {
    initialPressureDrop = filterConfig.initialPressureDrops[300];
  } else if (faceVelocity <= 350) {
    initialPressureDrop = filterConfig.initialPressureDrops[350];
  }

  if (faceVelocity > MAX_FACE_VELOCITY) {
    warnings.push('Face velocity exceeds 350 FPM - consider using a larger filter.');
  }
  if (initialPressureDrop > 0.075) {
    warnings.push('Initial pressure drop is high - monitor filter replacement frequency.');
  }
  if (faceVelocity > 500) {
    warnings.push('Face velocity is critically high - system efficiency will be severely impacted.');
  }

  return {
    totalCfm,
    filterArea,
    faceVelocity,
    initialPressureDrop,
    maxPressureDrop: 0.15,
    warnings,
  };
}

export function calculateFanLaw(input: FanLawInput): FanLawResult {
  const { widthInches, heightInches, ratedAirflowCfm, ratedPressureDrop, desiredAirflowCfm } = input;

  const filterArea = (widthInches * heightInches) / 144;
  const faceVelocity = filterArea > 0 ? desiredAirflowCfm / filterArea : 0;
  const velocityRatio = ratedAirflowCfm > 0 ? desiredAirflowCfm / ratedAirflowCfm : 0;
  const pressureRatio = Math.pow(velocityRatio, 2);
  const predictedPressureDrop = ratedPressureDrop * pressureRatio;

  const warnings: string[] = [];
  if (faceVelocity > MAX_FACE_VELOCITY) {
    warnings.push('Face velocity exceeds 350 FPM - consider using a larger filter.');
  }
  if (predictedPressureDrop > 0.5) {
    warnings.push('Predicted pressure drop is very high - system performance will be impacted.');
  }
  if (velocityRatio > 2) {
    warnings.push('Operating at more than 2x rated velocity - results may be inaccurate.');
  }

  return {
    faceVelocity,
    velocityRatio,
    pressureRatio,
    predictedPressureDrop,
    warnings,
  };
}

export function evaluateFilterCompatibility(
  filters: FilterData[],
  cfm: number,
  lengthInches: number,
  widthInches: number
): FilterCompatibilityResult[] {
  const area = (lengthInches * widthInches) / 144;
  if (area <= 0 || cfm <= 0) {
    return [];
  }

  return filters
    .filter((filter) => {
      if (!filter.size) return false;
      const parts = filter.size.split('x').map((part) => parseFloat(part));
      if (parts.length !== 2) return false;
      const [filterLength, filterWidth] = parts;
      return (
        Number.isFinite(filterLength) &&
        Number.isFinite(filterWidth) &&
        Math.abs(filterLength - lengthInches) < 0.1 &&
        Math.abs(filterWidth - widthInches) < 0.1
      );
    })
    .map((filter) => {
      const ratedArea = area;
      const ratedCfm = filter.rated_airflow ?? (filter.rated_fpm ? filter.rated_fpm * ratedArea : 0);
      const velocityRatio = ratedCfm > 0 ? cfm / ratedCfm : 0;
      const estimatedPressure = filter.rated_pd ? filter.rated_pd * Math.pow(velocityRatio, 2) : 0;

      let status: CompatibilityStatus = 'good';
      if (estimatedPressure > 0.5) status = 'critical';
      else if (estimatedPressure > 0.25) status = 'warning';

      return {
        ...filter,
        estimatedPressure,
        velocityRatio,
        status,
      };
    })
    .sort((a, b) => a.estimatedPressure - b.estimatedPressure);
}