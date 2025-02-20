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
  const allowedTypes = (extraParams.geometryTypes as string[] | undefined) || ["LineString", "MultiLineString"];
  let filteredSketch = sketch;
  
  if (sketch.type === "FeatureCollection") {
    console.log("calculateLength: Original feature types:", sketch.features.map((f: any) => f.geometry?.type));
    filteredSketch = {
      ...sketch,
      features: sketch.features.filter((feature: any) =>
        feature.geometry && allowedTypes.includes(feature.geometry.type)
      ),
    };
    console.log("calculateLength: Filtered feature types:", filteredSketch.features.map((f: any) => f.geometry?.type));
  } else {
    if (!allowedTypes.includes(sketch.geometry.type)) {
      throw new Error(`calculateLength: unsupported geometry type: ${sketch.geometry.type}`);
    }
  }
  
  const lengthInKilometers = turfLength(filteredSketch, { units: "kilometers" });
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
