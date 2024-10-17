import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { boundaryAreaOverlap } from "./boundaryAreaOverlap.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof boundaryAreaOverlap).toBe("function");
  });
  test("boundaryAreaOverlap - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await boundaryAreaOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "boundaryAreaOverlap", example.properties.name);
    }
  }, 60_000);
});