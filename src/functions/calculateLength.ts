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
import { distance as turfDistance } from "@turf/turf";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";

export interface LengthResults {
  length: number; // The longer side (used for cost calculations)
  width: number;  // The shorter side (swale width)
}

/**
 * Computes the dimensions of the polygon (in feet) by calculating the distances
 * between consecutive vertices of the exterior ring.
 * Returns an object with the longer side as "length" and the shorter side as "width".
 */
function computeDimensions(polygon: Polygon): { length: number; width: number } {
  const coords = polygon.coordinates[0];
  const edgeDistances: number[] = [];
  // Loop over each consecutive pair (ignoring the closing coordinate)
  for (let i = 0; i < coords.length - 1; i++) {
    const d = turfDistance(coords[i], coords[i + 1], { units: "feet" });
    edgeDistances.push(d);
  }
  const maxEdge = Math.max(...edgeDistances);
  const minEdge = Math.min(...edgeDistances);
  return { length: maxEdge, width: minEdge };
}

async function calculateLength(
  sketch: Sketch<Polygon | MultiPolygon> | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<LengthResults> {
  // Get the geography and perform antimeridian splitting and clipping.
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, { fallbackGroup: "default-boundary" });
  const splitSketch = splitSketchAntimeridian(sketch);
  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  // Normalize the result to an array of features.
  let features: any[] = [];
  if (clippedSketch.type === "FeatureCollection" && Array.isArray(clippedSketch.features)) {
    features = clippedSketch.features;
  } else {
    features = [clippedSketch];
  }

  // Use the first feature.
  const feature = features[0];
  if (!feature.geometry) {
    throw new Error("The drawn feature has no geometry.");
  }
  if (feature.geometry.type !== "Polygon") {
    throw new Error("The drawn geometry is not a Polygon.");
  }
  const polygon = feature.geometry as Polygon;

  // Compute dimensions.
  let { length, width } = computeDimensions(polygon);

  // Use an override width if provided.
  if (extraParams && extraParams.overrideWidth !== undefined) {
    width = extraParams.overrideWidth;
  }

  return { length, width };
}

export default new GeoprocessingHandler(calculateLength, {
  title: "calculateLength",
  description:
    "Calculates the dimensions of a polygon by computing its edge distances. Returns the longer side (length) and the shorter side (width) in feet. A width override may be provided.",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
