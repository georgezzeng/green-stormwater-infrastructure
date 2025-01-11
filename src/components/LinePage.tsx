import React, { useState } from "react";
import { AreaCard } from "./AreaCard.tsx";
import InfrastructureChart from "./InfrastructureChart.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { InfrastructureConfig, infrastructureTypes } from "../data/infrastructureData.ts";
import { PerimeterCard } from "./PerimeterCard.tsx";
import RainCaptureProgress from "./RainCaptureProgress.tsx";
import CostVsBudgetBar from "./CostVsBudgetBar.tsx";
import RemainingBudgetIndicator from "./RemainingBudgetIndicator.tsx";
import CostPerGallon from "./CostPerGallon.tsx";
import InfrastructureComparisonChart from "./InfrastructureComparisonChart.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(null);

  // Calculate estimated cost and capacity
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];
  const estimatedTotalCost = area ? area * config.costPerSqFt : 0;
  const capacityIncrease = area ? area * config.capacityIncreasePerSqFt : 0;

  return (
    <>
      <AreaCard onAreaCalculated={setArea} />
      <PerimeterCard onPerimeterCalculated={setPerimeter} />
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

      {area !== null && budget !== null && rainCaptureGoal !== null && (
        <div className="p-8 bg-white shadow rounded-md">
          <h2 className="text-2xl font-bold mb-4">{infrastructureTypes[infrastructureType].name} Analysis</h2>
          <InfrastructureChart area={area} infrastructureType={infrastructureType} />

          <div className="mt-8">
            <h3 className="text-xl font-semibold">Feasibility Analysis</h3>
            <p className="mt-2">Estimated Total Cost: ${estimatedTotalCost.toFixed(2)}</p>
            <RainCaptureProgress projectedCapacity={capacityIncrease} rainCaptureGoal={rainCaptureGoal} />
            <CostVsBudgetBar budget={budget} estimatedCost={estimatedTotalCost} />
            <RemainingBudgetIndicator budget={budget} estimatedCost={estimatedTotalCost} />
            <CostPerGallon estimatedCost={estimatedTotalCost} capacityIncrease={capacityIncrease} />
            <InfrastructureComparisonChart selectedType={infrastructureType} area={area} />
          </div>


        </div>
      )}
    </>
  );
};

export default ViabilityPage;
