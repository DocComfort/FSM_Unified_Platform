export interface AirflowPrediction {
  newCfm: number;
  predictedSupplySp: number;
  predictedReturnSp: number;
  predictedTotalSp: number;
}

export interface AirflowPredictionOptions {
  minCfm?: number;
  maxCfm?: number;
  step?: number;
}

/**
 * Predicts supply and return static pressure for a range of airflow targets using fan affinity laws.
 */
export function predictAirflowStaticPressure(
  measuredCfm: number,
  measuredSupplySp: number,
  measuredReturnSp: number,
  options: AirflowPredictionOptions = {}
): AirflowPrediction[] {
  const { minCfm = 300, maxCfm = 2500, step = 100 } = options;

  if (measuredCfm <= 0 || minCfm <= 0 || maxCfm < minCfm || step <= 0) {
    return [];
  }

  const predictions: AirflowPrediction[] = [];

  for (let newCfm = minCfm; newCfm <= maxCfm; newCfm += step) {
    const ratioSquared = Math.pow(newCfm / measuredCfm, 2);
    const predictedSupplySp = measuredSupplySp * ratioSquared;
    const predictedReturnSp = measuredReturnSp * ratioSquared;
    const predictedTotalSp = predictedSupplySp + predictedReturnSp;

    predictions.push({
      newCfm,
      predictedSupplySp,
      predictedReturnSp,
      predictedTotalSp,
    });
  }

  return predictions;
}