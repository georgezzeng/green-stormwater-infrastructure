import React, { useState } from "react";
import { AreaCard } from "./AreaCard.tsx";
import InfrastructureChart from "./InfrastructureChart.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { InfrastructureConfig, infrastructureTypes } from "../data/infrastructureData.ts";
import { PerimeterCard } from "./PerimeterCard.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(null);

  // Calculate estimated cost based on area
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];
  const estimatedTotalCost = area ? area * config.costPerSqFt : 0;
  const capacityIncrease = area ? area * config.capacityIncreasePerSqFt : 0;

  // Determine if the budget meets the estimated total cost
  const isBudgetSufficient = budget !== null && estimatedTotalCost <= budget;

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

      {/* Render analysis */}
      {area !== null && (
        <div style={{ padding: "2rem" }}>
          <h2>{infrastructureTypes[infrastructureType].name} Analysis</h2>
          <InfrastructureChart area={area} infrastructureType={infrastructureType} />
          <div style={{ marginTop: "2rem" }}>
            <h3>Feasibility Analysis</h3>
            <p>Estimated Total Cost: ${estimatedTotalCost.toFixed(2)}</p>
            <p>
              {budget !== null
                ? isBudgetSufficient
                  ? "Your budget is sufficient to cover the estimated cost."
                  : "Your budget is insufficient to cover the estimated cost."
                : "Please enter your budget for analysis."}
            </p>
            <p>
              {rainCaptureGoal !== null
                ? `Projected Rain Capture Capacity: ${capacityIncrease.toFixed(
                    2
                  )} gallons.`
                : "Please enter your rain capture goal for comparison."}
            </p>
            {rainCaptureGoal !== null && (
              <p>
                {capacityIncrease >= rainCaptureGoal
                  ? "The projected capacity meets or exceeds your rain capture goal."
                  : "The projected capacity does not meet your rain capture goal."}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ViabilityPage;
