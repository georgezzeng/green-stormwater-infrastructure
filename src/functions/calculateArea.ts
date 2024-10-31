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

export interface AreaResults {
  /** area of sketch in square feet */
  area: number;
}

async function calculateArea(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<AreaResults> {
  console.log("Sketch Data Received:", JSON.stringify(sketch, null, 2));

  // Use caller-provided geographyId if provided
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  // Get geography features, falling back to geography assigned to default-boundary group
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });

  // Support sketches crossing antimeridian
  const splitSketch = splitSketchAntimeridian(sketch);

  // Clip to portion of sketch within current geography
  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  // Calculate the area in square meters and convert to square feet (1 square meter = 10.7639 square feet)
  const areaInSquareFeet = turfArea(clippedSketch) * 10.7639;

  return {
    area: areaInSquareFeet,
  };
}

export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Calculates area of the sketch in square feet",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
  requiresProperties: [],
});
