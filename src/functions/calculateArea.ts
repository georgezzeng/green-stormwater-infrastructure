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
  area: number;
}

async function calculateArea(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<AreaResults> {
  // console.log("Sketch Data Received:", JSON.stringify(sketch, null, 2));

  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });

  const splitSketch = splitSketchAntimeridian(sketch);

  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  const areaInSquareFeet = turfArea(clippedSketch) * 10.7639;

  return {
    area: areaInSquareFeet,
  };
}

export default new GeoprocessingHandler(calculateArea, {
  title: "calculateArea",
  description: "Calculates area of the sketch in square feet",
  timeout: 60,
  memory: 1024,
  executionMode: "async",
  requiresProperties: [],
});
