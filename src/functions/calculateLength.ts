// calculateLength.ts
import {
  Sketch,
  SketchCollection,
  DefaultExtraParams,
  GeoprocessingHandler,
} from "@seasketch/geoprocessing";
import { length as turfLength } from "@turf/turf";
import type { LineString, MultiLineString } from "geojson";
import { computeGeometryCounts, computeFeatureDetails } from "./geometryUtils";

export interface LengthResults {
  length: number;
  breakdown: { [geometryType: string]: number };
  details: { [geometryType: string]: number[] };
}

async function calculateLength(
  sketch: Sketch<LineString | MultiLineString> | SketchCollection<LineString | MultiLineString>,
  extraParams: DefaultExtraParams = {}
): Promise<LengthResults> {
  const allowedTypes = (extraParams.geometryTypes as string[] | undefined) || ["LineString", "MultiLineString"];
  let filteredSketch = sketch;
  
  if (sketch.type === "FeatureCollection") {
    // console.log("calculateLength: Original feature types:", sketch.features.map((f: any) => f.geometry?.type));
    filteredSketch = {
      ...sketch,
      features: sketch.features.filter((feature: any) =>
        feature.geometry && allowedTypes.includes(feature.geometry.type)
      ),
    };
    // console.log("calculateLength: Filtered feature types:", filteredSketch.features.map((f: any) => f.geometry?.type));
  } else {
    if (!allowedTypes.includes(sketch.geometry.type)) {
      throw new Error(`calculateLength: unsupported geometry type: ${sketch.geometry.type}`);
    }
  }
  
  // Compute breakdown and individual line lengths
  const breakdown = computeGeometryCounts(filteredSketch);
  const details = computeFeatureDetails(filteredSketch, (feature) =>
    turfLength(feature, { units: "kilometers" }) * 3280.84
  );

  const lengthInKilometers = turfLength(filteredSketch, { units: "kilometers" });
  const lengthInFeet = lengthInKilometers * 3280.84;

  return { length: lengthInFeet, breakdown, details };
}

export default new GeoprocessingHandler(calculateLength, {
  title: "calculateLength",
  description: "Calculates the length of the sketch in feet",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
