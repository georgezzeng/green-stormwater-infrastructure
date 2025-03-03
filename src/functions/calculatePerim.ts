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
  import { length as turfLength, lineString } from "@turf/turf";
  import project from "../../project/projectClient.ts";
  import { clipToGeography } from "../util/clipToGeography.ts";
  
  export interface PerimeterResults {
    perimeter: number;
  }
  
  async function calculatePerim(
    sketch:
      | Sketch<Polygon | MultiPolygon>
      | SketchCollection<Polygon | MultiPolygon>,
    extraParams: DefaultExtraParams = {}
  ): Promise<PerimeterResults> {
    // console.log("Sketch Data Received:", JSON.stringify(sketch, null, 2));
  
    const geographyId = getFirstFromParam("geographyIds", extraParams);
    const curGeography = project.getGeographyById(geographyId, {
      fallbackGroup: "default-boundary",
    });
  
    const splitSketch = splitSketchAntimeridian(sketch);
  
    const clippedSketch = await clipToGeography(splitSketch, curGeography);

    let perimeterInMeters = 0;
    if (clippedSketch.geometry.type === "Polygon") {
      perimeterInMeters = turfLength(lineString(clippedSketch.geometry.coordinates[0]), { units: "meters" });
    } else if (clippedSketch.geometry.type === "MultiPolygon") {
      for (const polygon of clippedSketch.geometry.coordinates) {
        perimeterInMeters += turfLength(lineString(polygon[0]), { units: "meters" });
      }
    }
  
    const perimeterInFeet = perimeterInMeters * 3.28084;
  
    return {
      perimeter: perimeterInFeet,
    };
  }
  
  export default new GeoprocessingHandler(calculatePerim, {
    title: "calculatePerim",
    description: "Calculates perimeter of the sketch in feet",
    timeout: 60,
    memory: 1024,
    executionMode: "async",
    requiresProperties: [],
  });
  