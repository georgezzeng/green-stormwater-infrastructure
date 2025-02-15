import {
  Sketch,
  SketchCollection,
  DefaultExtraParams,
  GeoprocessingHandler,
} from "@seasketch/geoprocessing";
import { length as turfLength } from "@turf/turf";
import type { LineString, MultiLineString } from "geojson";

export interface LengthResults {
  length: number;
}

async function calculateLength(
  sketch: Sketch<LineString | MultiLineString> | SketchCollection<LineString | MultiLineString>,
  extraParams: DefaultExtraParams = {}
): Promise<LengthResults> {
  // Calculate the length in kilometers using Turf
  const lengthInKilometers = turfLength(sketch, { units: "kilometers" });
  // Convert kilometers to feet (1 km = 3280.84 feet)
  const lengthInFeet = lengthInKilometers * 3280.84;

  return { length: lengthInFeet };
}

export default new GeoprocessingHandler(calculateLength, {
  title: "calculateLength",
  description: "Calculates the length of the sketch in feet",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
