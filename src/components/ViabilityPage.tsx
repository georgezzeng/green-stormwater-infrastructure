import React, { useState, useEffect } from "react";
import { AreaCard } from "./AreaCard.tsx";
import { LineCard } from "./LineCard.tsx";
import { PointCard } from "./PointCard.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.tsx";
import RainCaptureProgress from "./RainCaptureProgress.tsx";
import CostVsBudgetBar from "./CostVsBudgetBar.tsx";
import RemainingBudgetIndicator from "./RemainingBudgetIndicator.tsx";
import CostPerGallon from "./CostPerGallon.tsx";
import InfrastructureChart from "./InfrastructureChart.tsx";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import "../styles/styles.css";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
  featureId: string;
}

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType, featureId }) => {
  const [area, setArea] = useState<number | null>(null);
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [pointCount, setPointCount] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(null);
  const [tab, setTab] = useState<"analysis" | "details">("analysis");

  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(featureId) || "{}");
    if (savedData.budget) setBudget(savedData.budget);
    if (savedData.rainCaptureGoal) setRainCaptureGoal(savedData.rainCaptureGoal);
  }, [featureId]);

  const saveData = () => {
    const data = { budget, rainCaptureGoal};
    localStorage.setItem(featureId, JSON.stringify(data));
  };

  useEffect(() => {
    if (budget !== null && rainCaptureGoal !== null) {
      saveData();
    }
  }, [budget, rainCaptureGoal]);

  let estimatedTotalCost = 0;
  let capacityIncrease = 0;

  if (config.category === "polygon" && area) {
    estimatedTotalCost = area * (config.costPerSqFt || 0);
    capacityIncrease = area * (config.capacityIncreasePerSqFt || 0);
  } else if (config.category === "line" && lineLength) {
    estimatedTotalCost = lineLength * (config.costPerFt || 0);
    capacityIncrease = lineLength * (config.capacityIncreasePerFt || 0);
  } else if (config.category === "point" && pointCount) {
    estimatedTotalCost = pointCount * (config.costPerPoint || 0);
    capacityIncrease = pointCount * (config.capacityIncreasePerPoint || 0);
  }

  return (
    <div className="viability-page">
      <div className="tab-container">
        <button
          className={`tab ${tab === "analysis" ? "active-tab" : ""}`}
          onClick={() => setTab("analysis")}
        >
          Analysis
        </button>
        <button
          className={`tab ${tab === "details" ? "active-tab" : ""}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
      </div>

      {tab === "analysis" && (
        <div className="analysis-section">
          {config.category === "polygon" && <AreaCard onAreaCalculated={setArea} />}
          {config.category === "line" && (
            <LineCard
              onLineDimensionsCalculated={(length: number) => setLineLength(length)}
            />
          )}
          {config.category === "point" && <PointCard onPointCountCalculated={setPointCount} />}
          <SketchAttributesCard autoHide />

          <div className="input-card">
            <h3 className="text-lg font-bold mb-2">User Inputs</h3>
            <label className="block mb-4">
              <span className="text-gray-700">Budget (USD):</span>
              <input
                type="number"
                value={budget ?? ""}
                onChange={(e) => setBudget(Number(e.target.value))}
                placeholder="Enter your budget"
                className="styled-input"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Rain Capture Goal (gallons):</span>
              <input
                type="number"
                value={rainCaptureGoal ?? ""}
                onChange={(e) => setRainCaptureGoal(Number(e.target.value))}
                placeholder="Enter rain capture goal"
                className="styled-input"
              />
            </label>
          </div>

          {(area || lineLength || pointCount) && budget && rainCaptureGoal && (
            <>
              <div className="result-card">
                <InfrastructureChart
                  area={area}
                  lineLength={lineLength}
                  pointCount={pointCount}
                  infrastructureType={infrastructureType}
                />
              </div>
              <div className="result-card">
                <RainCaptureProgress
                  projectedCapacity={capacityIncrease}
                  rainCaptureGoal={rainCaptureGoal}
                />
              </div>
              <div className="result-card">
                <CostVsBudgetBar budget={budget} estimatedCost={estimatedTotalCost} />
              </div>
              <div className="result-card">
                <RemainingBudgetIndicator
                  budget={budget}
                  estimatedCost={estimatedTotalCost}
                />
              </div>
              <div className="result-card">
                <CostPerGallon
                  estimatedCost={estimatedTotalCost}
                  capacityIncrease={capacityIncrease}
                />
              </div>
            </>
          )}
        </div>
      )}

      {tab === "details" && <FeatureDetailsPage infrastructureType={infrastructureType} />}
    </div>
  );
};

export default ViabilityPage;
