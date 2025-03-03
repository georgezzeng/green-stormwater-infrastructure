// calculatePoint.ts
import {
  Sketch,
  SketchCollection,
  Point,
  MultiPoint,
  GeoprocessingHandler,
  DefaultExtraParams,
} from "@seasketch/geoprocessing";
import { computeGeometryCounts, computeFeatureDetails } from "./geometryUtils";

export interface PointResults {
  count: number;
  breakdown: { [geometryType: string]: number };
  details: { [geometryType: string]: number[] };
}

function countPointsInFeature(feature: any): number {
  if (!feature.geometry) return 0;
  const geom = feature.geometry;
  if (geom.type === "Point") {
    return 1;
  } else if (geom.type === "MultiPoint") {
    return Array.isArray(geom.coordinates) ? geom.coordinates.length : 0;
  }
  throw new Error(`Unsupported geometry type for points: ${geom.type}`);
}

async function calculatePoint(
  sketch: Sketch<Point | MultiPoint> | SketchCollection<Point | MultiPoint>,
  extraParams: DefaultExtraParams = {}
): Promise<PointResults> {
  const allowedTypes = (extraParams.geometryTypes as string[] | undefined) || ["Point", "MultiPoint"];
  let filteredSketch = sketch;
  
  if (sketch.type === "FeatureCollection") {
    // console.log("calculatePoint: Original feature types:", sketch.features.map((f: any) => f.geometry?.type));
    filteredSketch = {
      ...sketch,
      features: sketch.features.filter((feature: any) =>
        feature.geometry && allowedTypes.includes(feature.geometry.type)
      ),
    };
    // console.log("calculatePoint: Filtered feature types:", filteredSketch.features.map((f: any) => f.geometry?.type));
  } else {
    if (!allowedTypes.includes(sketch.geometry.type)) {
      throw new Error(`calculatePoint: unsupported geometry type: ${sketch.geometry.type}`);
    }
  }

  let count = 0;
  if (filteredSketch.type === "FeatureCollection" || Array.isArray(filteredSketch.features)) {
    for (const feature of filteredSketch.features) {
      count += countPointsInFeature(feature);
    }
  } else {
    count = countPointsInFeature(filteredSketch);
  }
  
  // Compute breakdown and individual point counts per feature
  const breakdown = computeGeometryCounts(filteredSketch);
  const details = computeFeatureDetails(filteredSketch, (feature) => countPointsInFeature(feature));

  return { count, breakdown, details };
}

export default new GeoprocessingHandler(calculatePoint, {
  title: "calculatePoint",
  description: "Counts the number of points in a sketch",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
