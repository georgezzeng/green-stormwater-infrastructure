
// geometryUtils.ts

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


