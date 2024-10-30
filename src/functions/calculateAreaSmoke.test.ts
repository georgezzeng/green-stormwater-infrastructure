/**
 * @vitest-environment node
 */
import Handler from "./calculateArea.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";

const calculateArea = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof calculateArea).toBe("function");
  });
  test("calculateArea - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await calculateArea(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "calculateArea", example.properties.name);
    }
  }, 100_000);
});
