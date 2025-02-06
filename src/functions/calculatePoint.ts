import {
  Sketch,
  SketchCollection,
  Point,
  MultiPoint,
  GeoprocessingHandler,
  DefaultExtraParams,
} from "@seasketch/geoprocessing";

export interface PointResults {
  count: number; // Total number of points
}

// Helper to count points in a single feature
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
  console.log("Sketch Data Received:", JSON.stringify(sketch, null, 2));
  let count = 0;

  // Check if the sketch is a FeatureCollection or a single Feature
  if (sketch.type === "FeatureCollection" || Array.isArray(sketch.features)) {
    for (const feature of sketch.features) {
      count += countPointsInFeature(feature);
    }
  } else {
    count = countPointsInFeature(sketch);
  }

  return { count };
}

export default new GeoprocessingHandler(calculatePoint, {
  title: "calculatePoint",
  description: "Counts the number of points in a sketch",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
