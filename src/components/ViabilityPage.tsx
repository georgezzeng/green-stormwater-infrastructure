import React, { useState } from "react";
import { AreaCard } from "./AreaCard.tsx";
import InfrastructureChart from "./InfrastructureChart.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { InfrastructureConfig, infrastructureTypes } from "../data/infrastructureData.ts";
import { PerimeterCard } from "./PerimeterCard.tsx";
import RainCaptureProgress from "./RainCaptureProgress.tsx";
import CostVsBudgetBar from "./CostVsBudgetBar.tsx";
import RemainingBudgetIndicator from "./RemainingBudgetIndicator.tsx";

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

      <div style={{ margin: "2rem 0" }}>
        <label>
          Budget (USD):
          <input
            type="number"
            value={budget ?? ""}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="Enter your budget"
          />
        </label>
        <br />
        <label>
          Rain Capture Goal (gallons):
          <input
            type="number"
            value={rainCaptureGoal ?? ""}
            onChange={(e) => setRainCaptureGoal(Number(e.target.value))}
            placeholder="Enter your rain capture goal"
          />
        </label>
      </div>

      {area !== null && budget !== null && rainCaptureGoal !== null && (
        <div style={{ padding: "2rem" }}>
          <h2>{infrastructureTypes[infrastructureType].name} Analysis</h2>
          <InfrastructureChart area={area} infrastructureType={infrastructureType} />

          <div style={{ marginTop: "2rem" }}>
            <h3>Feasibility Analysis</h3>
            <p>Estimated Total Cost: ${estimatedTotalCost.toFixed(2)}</p>
            <RainCaptureProgress projectedCapacity={capacityIncrease} rainCaptureGoal={rainCaptureGoal} />
            <CostVsBudgetBar budget={budget} estimatedCost={estimatedTotalCost} />
            <RemainingBudgetIndicator budget={budget} estimatedCost={estimatedTotalCost} />
          </div>
        </div>
      )}
    </>
  );
};

export default ViabilityPage;
