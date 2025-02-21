import { area as turfArea, length as turfLength } from "@turf/turf";



/**
 * Computes a breakdown by practice.
 * 
 * @param sketch A Sketch or SketchCollection.
 * @param computeFn A function that computes a numeric value from a feature.
 * @param mapping A mapping from sketchClassId to an infrastructure practice key.
 * @returns An object whose keys are practice keys and values are details about that practice.
 */
export function computePracticeBreakdown(
  sketch: any,
  computeFn: (feature: any) => number,
  mapping: Record<string, string>
): { [practiceKey: string]: { count: number; total: number; details: number[] } } {
  const breakdown: { [practiceKey: string]: { count: number; total: number; details: number[] } } = {};

  if (sketch.type === "FeatureCollection" && Array.isArray(sketch.features)) {
    sketch.features.forEach((feature: any) => {
      const sketchClassId = feature.properties?.sketchClassId;
      if (!sketchClassId) return; // Skip features without a sketchClassId.
      const practiceKey = mapping[sketchClassId];
      if (!practiceKey) return; // Skip if mapping not found.
      const value = computeFn(feature);
      if (breakdown[practiceKey]) {
        breakdown[practiceKey].count += 1;
        breakdown[practiceKey].total += value;
        breakdown[practiceKey].details.push(value);
      } else {
        breakdown[practiceKey] = { count: 1, total: value, details: [value] };
      }
    });
  } else if (sketch.geometry) {
    const sketchClassId = sketch.properties?.sketchClassId;
    if (sketchClassId) {
      const practiceKey = mapping[sketchClassId];
      if (practiceKey) {
        const value = computeFn(sketch);
        breakdown[practiceKey] = { count: 1, total: value, details: [value] };
      }
    }
  }
  return breakdown;
}



/**
 * Computes the counts of features for each geometry type.
 */
export function computeGeometryCounts(sketch: any): { [geometryType: string]: number } {
    if (sketch.type === "FeatureCollection" && Array.isArray(sketch.features)) {
      return sketch.features.reduce((counts: { [key: string]: number }, feature: any) => {
        const type = feature.geometry?.type;
        if (type) {
          counts[type] = (counts[type] || 0) + 1;
        }
        return counts;
      }, {});
    } else if (sketch.geometry && sketch.geometry.type) {
      return { [sketch.geometry.type]: 1 };
    } else {
      return {};
    }
  }


/**
 * Computes individual values for each feature.
 * Given a FeatureCollection and a callback that computes a value from a feature,
 * returns an object mapping geometry type to an array of computed values.
 */
export function computeFeatureDetails(
  sketch: any,
  computeValue: (feature: any) => number
): { [geometryType: string]: number[] } {
  const details: { [geometryType: string]: number[] } = {};
  if (sketch.type === "FeatureCollection" && Array.isArray(sketch.features)) {
    sketch.features.forEach((feature: any) => {
      const type = feature.geometry?.type;
      if (type) {
        const val = computeValue(feature);
        if (!details[type]) {
          details[type] = [];
        }
        details[type].push(val);
      }
    });
  } else if (sketch.geometry && sketch.geometry.type) {
    details[sketch.geometry.type] = [computeValue(sketch)];
  }
  return details;
}


