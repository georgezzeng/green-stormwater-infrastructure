// calculateCollection.ts
import {
    Sketch,
    SketchCollection,
    DefaultExtraParams,
    GeoprocessingHandler,
  } from "@seasketch/geoprocessing";
  import { area as turfArea, length as turfLength } from "@turf/turf";
  import { computeGeometryCounts, computeFeatureDetails } from "./geometryUtils.ts";
  import { sketchClassIdMapping } from "../data/sketchClassIdMapping.ts"; // Adjust the path as needed
  
  // Helper function to count points in a feature.
  function countPointsInFeature(feature: any): number {
    if (!feature.geometry) return 0;
    const geom = feature.geometry;
    if (geom.type === "Point") {
      return 1;
    } else if (geom.type === "MultiPoint") {
      return Array.isArray(geom.coordinates) ? geom.coordinates.length : 0;
    }
    throw new Error(`Unsupported geometry type for points: ${geom.type}`);
  }
  
  // This interface defines the output structure for a collection.
  export interface CollectionResults {
    total: number;
    breakdown: {
      [practiceKey: string]: {
        count: number;
        total: number;
        details: number[];
        sketchNames: string[];
      };
    };
  }
  
  /**
   * calculateCollection iterates through a FeatureCollection that may include polygons,
   * lines, and points. For each feature, it:
   *  - Computes a metric:
   *      - Polygons/MultiPolygons: area in square feet (using Turf’s area)
   *      - Lines/MultiLineStrings: length in feet (using Turf’s length)
   *      - Points/MultiPoints: count of points
   *  - Groups the results by practice using the provided sketchClassId mapping.
   */
  async function calcCollection(
    sketch: Sketch | SketchCollection,
    extraParams: DefaultExtraParams = {}
  ): Promise<CollectionResults> {
    // Expecting a FeatureCollection for collections.
    if (sketch.type !== "FeatureCollection") {
      throw new Error("calculateCollection expects a FeatureCollection");
    }
  
    let totalMetric = 0;
    const breakdown: CollectionResults["breakdown"] = {};
  
    for (const feature of sketch.features) {
      // Determine metric based on geometry type.
      let metric = 0;
      const geomType = feature.geometry?.type;
      if (geomType === "Polygon" || geomType === "MultiPolygon") {
        metric = turfArea(feature) * 10.7639; // Convert to square feet.
      } else if (geomType === "LineString" || geomType === "MultiLineString") {
        metric = turfLength(feature, { units: "kilometers" }) * 3280.84; // Convert km to feet.
      } else if (geomType === "Point" || geomType === "MultiPoint") {
        metric = countPointsInFeature(feature);
      } else {
        // Skip unsupported geometry types.
        continue;
      }
      totalMetric += metric;
  
      // Use the feature's sketchClassId property and mapping to determine the practice.
      const sketchClassId = feature.properties?.sketchClassId;
      const practiceKey = sketchClassIdMapping[sketchClassId] || "unknown";
  
      if (!breakdown[practiceKey]) {
        breakdown[practiceKey] = {
          count: 0,
          total: 0,
          details: [],
          sketchNames: [],
        };
      }
      breakdown[practiceKey].count += 1;
      breakdown[practiceKey].total += metric;
      breakdown[practiceKey].details.push(metric);
  
      // Also add the sketch's name (from properties) to the breakdown if not already added.
      const sketchName = feature.properties?.name || practiceKey;
      if (!breakdown[practiceKey].sketchNames.includes(sketchName)) {
        breakdown[practiceKey].sketchNames.push(sketchName);
      }
    }
  
    return {
      total: totalMetric,
      breakdown,
    };
  }
  
  export default new GeoprocessingHandler(calcCollection, {
    title: "calcCollection",
    description:
      "Calculates combined metrics (area for polygons, length for lines, count for points) for a sketch collection grouped by practice using the sketchClassId mapping.",
    timeout: 60,
    memory: 1024,
    executionMode: "async",
    requiresProperties: [],
  });
  