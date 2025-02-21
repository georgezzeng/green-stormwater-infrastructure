// calculateArea.ts
import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  splitSketchAntimeridian,
} from "@seasketch/geoprocessing";
import { area as turfArea } from "@turf/turf";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";
import { computeGeometryCounts, computeFeatureDetails } from "./geometryUtils.ts";

export interface AreaResults {
  area: number;
  breakdown: { [geometryType: string]: number };
  details: { [geometryType: string]: number[] };
}

async function calculateArea(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<AreaResults> {
  // Set default allowed types if not provided.
  const allowedTypes = (extraParams.geometryTypes as string[] | undefined) || ["Polygon", "MultiPolygon"];
  
  let filteredSketch = sketch;
  if (sketch.type === "FeatureCollection") {
    console.log("calculateArea: Original feature types:", sketch.features.map((f: any) => f.geometry?.type));
    filteredSketch = {
      ...sketch,
      features: sketch.features.filter((feature: any) =>
        feature.geometry && allowedTypes.includes(feature.geometry.type)
      ),
    };
    console.log("calculateArea: Filtered feature types:", filteredSketch.features.map((f: any) => f.geometry?.type));
  } else {
    if (!allowedTypes.includes(sketch.geometry.type)) {
      throw new Error(`calculateArea: unsupported geometry type: ${sketch.geometry.type}`);
    }
  }

  // Compute breakdown and individual area details
  const breakdown = computeGeometryCounts(filteredSketch);
  // Note: we will compute individual area (in square feet) for each feature.
  const details = computeFeatureDetails(filteredSketch, (feature) => turfArea(feature) * 10.7639);

  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });

  const splitSketch = splitSketchAntimeridian(filteredSketch);
  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  // Total area computed from the entire (clipped) geometry.
  const areaInSquareFeet = turfArea(clippedSketch) * 10.7639;

  return { area: areaInSquareFeet, breakdown, details };
}

export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Calculates area of the sketch in square feet",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
