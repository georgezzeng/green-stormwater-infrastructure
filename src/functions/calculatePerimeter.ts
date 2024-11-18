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
  import project from "../../project/projectClient.js";
  import { clipToGeography } from "../util/clipToGeography.js";
  
  export interface PerimeterResults {
    /** perimeter of sketch in feet */
    perimeter: number;
  }
  
  async function calculatePerimeter(
    sketch:
      | Sketch<Polygon | MultiPolygon>
      | SketchCollection<Polygon | MultiPolygon>,
    extraParams: DefaultExtraParams = {}
  ): Promise<PerimeterResults> {
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
  
    // Convert MultiPolygon or Polygon sketch to LineString for perimeter calculation
    let perimeterInMeters = 0;
    if (clippedSketch.geometry.type === "Polygon") {
      perimeterInMeters = turfLength(lineString(clippedSketch.geometry.coordinates[0]), { units: "meters" });
    } else if (clippedSketch.geometry.type === "MultiPolygon") {
      for (const polygon of clippedSketch.geometry.coordinates) {
        perimeterInMeters += turfLength(lineString(polygon[0]), { units: "meters" });
      }
    }
  
    // Convert perimeter from meters to feet (1 meter = 3.28084 feet)
    const perimeterInFeet = perimeterInMeters * 3.28084;
  
    return {
      perimeter: perimeterInFeet,
    };
  }
  
  export default new GeoprocessingHandler(calculatePerimeter, {
    title: "calculatePerimeter",
    description: "Calculates perimeter of the sketch in feet",
    timeout: 60, // seconds
    memory: 1024, // megabytes
    executionMode: "async",
    requiresProperties: [],
  });
  