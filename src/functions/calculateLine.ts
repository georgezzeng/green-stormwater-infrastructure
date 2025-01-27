import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  LineString,
  MultiLineString,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  splitSketchAntimeridian,
} from "@seasketch/geoprocessing";
import { length as turfLength, area as turfArea } from "@turf/turf";
import featureToLine from "@turf/polygon-to-line"; // Convert polygons to lines
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";

export interface LineResults {
  length: number; // Length in feet
}

async function calculateLine(
  sketch: Sketch<LineString | MultiLineString | Polygon | MultiPolygon> | SketchCollection<LineString | MultiLineString | Polygon | MultiPolygon>, // Accept narrow polygons
  extraParams: DefaultExtraParams = {}
): Promise<LineResults> {
  const geographyId = getFirstFromParam("geographyIds", extraParams);

  // Get the current geography, falling back to the default boundary
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });

  // Validate input geometry type
  if (
    !(
      sketch.geometry.type === "Polygon" ||
      sketch.geometry.type === "MultiPolygon" ||
      sketch.geometry.type === "LineString" ||
      sketch.geometry.type === "MultiLineString"
    )
  ) {
    throw new Error("Input geometry is not a valid Polygon, MultiPolygon, LineString, or MultiLineString");
  }

  // Support sketches crossing the antimeridian
  const splitSketch = splitSketchAntimeridian(sketch);

  // Clip the sketch to the current geography
  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  // Ensure the clipped sketch has valid geometry
  if (!clippedSketch.geometry) {
    throw new Error("Clipped sketch has no geometry.");
  }

  let geometry = clippedSketch.geometry;

  // Handle Polygon or MultiPolygon
  if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
    const area = turfArea(clippedSketch);
    const perimeter = turfLength(featureToLine(clippedSketch), { units: "kilometers" }) * 3280.84; // Perimeter in feet

    if (area < 1 || perimeter / area > 100) {
      // Treat as a line if the polygon is narrow
      geometry = featureToLine(clippedSketch).geometry;
    } else {
      throw new Error("Input polygon is not a narrow polygon and cannot be treated as a line.");
    }
  }

  // Handle LineString or MultiLineString
  if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
    // Calculate the length in kilometers and convert to feet (1 km = 3280.84 feet)
    const lengthInFeet = turfLength({ type: "Feature", geometry }, { units: "kilometers" }) * 3280.84;
    return { length: lengthInFeet };
  }

  // Throw error for unsupported geometry types
  throw new Error(`Unsupported geometry type: ${geometry.type}`);
}

export default new GeoprocessingHandler(calculateLine, {
  title: "calculateLine",
  description: "Calculates the length of line sketches or narrow polygons in feet",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
