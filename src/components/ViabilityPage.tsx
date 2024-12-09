import React, { useState } from "react";
import { AreaCard } from "./AreaCard.tsx";
import { PerimeterCard } from "./PerimeterCard.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import RainCaptureProgress from "./RainCaptureProgress.tsx";
import CostVsBudgetBar from "./CostVsBudgetBar.tsx";
import RemainingBudgetIndicator from "./RemainingBudgetIndicator.tsx";
import CostPerGallon from "./CostPerGallon.tsx";
import InfrastructureChart from "./InfrastructureChart.tsx";
import InfrastructureComparisonChart from "./InfrastructureComparisonChart.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const [area, setArea] = useState<number | null>(null); // For polygons
  const [perimeter, setPerimeter] = useState<number | null>(null); // For polygons
  const [pointCount, setPointCount] = useState<number | null>(null); // For points
  const [lineLength, setLineLength] = useState<number | null>(null); // For lines
  const [budget, setBudget] = useState<number | null>(null);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(null);

  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  // Calculate estimated cost and capacity
  let estimatedTotalCost = 0;
  let capacityIncrease = 0;

  if (config.category === "polygon" && area) {
    estimatedTotalCost = area * config.costPerSqFt;
    capacityIncrease = area * config.capacityIncreasePerSqFt;
  } else if (config.category === "point" && pointCount) {
    estimatedTotalCost = pointCount * config.costPerSqFt;
    capacityIncrease = pointCount * config.capacityIncreasePerSqFt;
  } else if (config.category === "line" && lineLength) {
    estimatedTotalCost = lineLength * config.costPerSqFt;
    capacityIncrease = lineLength * config.capacityIncreasePerSqFt;
  }

  return (
    <>
      {/* Input forms based on infrastructure category */}
      {config.category === "polygon" && (
        <>
          <AreaCard onAreaCalculated={setArea} />
          <PerimeterCard onPerimeterCalculated={setPerimeter} />
        </>
      )}
      {config.category === "point" && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Number of Points (e.g., Trees):
            <input
              type="number"
              value={pointCount ?? ""}
              onChange={(e) => setPointCount(Number(e.target.value))}
              placeholder="Enter number of points"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </label>
        </div>
      )}
      {config.category === "line" && (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Total Line Length (e.g., Swale Length in ft):
            <input
              type="number"
              value={lineLength ?? ""}
              onChange={(e) => setLineLength(Number(e.target.value))}
              placeholder="Enter total line length"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </label>
        </div>
      )}

      {/* Shared inputs for all types */}
      <SketchAttributesCard autoHide />

      <div className="my-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Budget (USD):
            <input
              type="number"
              value={budget ?? ""}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="Enter your budget"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </label>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Rain Capture Goal (gallons):
            <input
              type="number"
              value={rainCaptureGoal ?? ""}
              onChange={(e) => setRainCaptureGoal(Number(e.target.value))}
              placeholder="Enter your rain capture goal"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </label>
        </div>
      </div>

      {/* Analysis Section */}
      {(area !== null || pointCount !== null || lineLength !== null) &&
        budget !== null &&
        rainCaptureGoal !== null && (
          <div className="p-8 bg-white shadow rounded-md">
            <h2 className="text-2xl font-bold mb-4">{config.name} Analysis</h2>
            <InfrastructureChart
              area={area}
              pointCount={pointCount}
              lineLength={lineLength}
              infrastructureType={infrastructureType}
            />

            <div className="mt-8">
              <h3 className="text-xl font-semibold">Feasibility Analysis</h3>
              <p className="mt-2">Estimated Total Cost: ${estimatedTotalCost.toFixed(2)}</p>
              <RainCaptureProgress
                projectedCapacity={capacityIncrease}
                rainCaptureGoal={rainCaptureGoal}
              />
              <CostVsBudgetBar budget={budget} estimatedCost={estimatedTotalCost} />
              <RemainingBudgetIndicator
                budget={budget}
                estimatedCost={estimatedTotalCost}
              />
              <CostPerGallon
                estimatedCost={estimatedTotalCost}
                capacityIncrease={capacityIncrease}
              />
              <InfrastructureComparisonChart
                selectedType={infrastructureType}
                area={area}
                pointCount={pointCount}
                lineLength={lineLength}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default ViabilityPage;
