import React, { useState, useEffect } from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes } from "../data/infrastructureData.ts";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";
import CaptureAnalysisPage from "./CaptureAnalysis.tsx";
import CalculationCardsLoader from "./CalculationCardsLoader.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

type TabOption = "cost" | "capture" | "details";

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  // Use string state for the inputs to preserve intermediate user input.
  const [area, setArea] = useState<number | null>(0);
  const [lineLength, setLineLength] = useState<number | null>(0);
  const [pointCount, setPointCount] = useState<number | null>(0);
  const [budgetInput, setBudgetInput] = useState<string>("100"); // default as string
  const [rainCaptureGoalInput, setRainCaptureGoalInput] = useState<string>("100"); // default as string
  const [tab, setTab] = useState<TabOption>("cost");

  // On mount, load from localStorage.
  useEffect(() => {
    const storedBudget = localStorage.getItem("budget");
    const storedCapture = localStorage.getItem("rainCaptureGoal");
    if (storedBudget) setBudgetInput(storedBudget);
    if (storedCapture) setRainCaptureGoalInput(storedCapture);
  }, []);

  // Save shared state when changed.
  useEffect(() => {
    localStorage.setItem("budget", budgetInput);
    localStorage.setItem("rainCaptureGoal", rainCaptureGoalInput);
  }, [budgetInput, rainCaptureGoalInput]);

  // Convert the string inputs to numbers for calculations.
  const budget = parseFloat(budgetInput) || 0;
  const rainCaptureGoal = parseFloat(rainCaptureGoalInput) || 0;

  // Get the infrastructure config and calculate estimated cost & capture based on geometry values.
  const config = infrastructureTypes[infrastructureType];
  let calculatedCost = 0;
  let calculatedCapture = 0;

  if (config.category === "polygon") {
    calculatedCost = (area ?? 0) * (config.capitalCostPerSqFt || 0);
    calculatedCapture = (area ?? 0) * (config.capacityIncreasePerSqFt || 0);
  } else if (config.category === "line") {
    calculatedCost = (lineLength ?? 0) * (config.capitalCostPerFt || 0);
    calculatedCapture = (lineLength ?? 0) * (config.capacityIncreasePerFt || 0);
  } else if (config.category === "point") {
    calculatedCost = (pointCount ?? 0) * (config.capitalCostPerPoint || 0);
    calculatedCapture = (pointCount ?? 0) * (config.capacityIncreasePerPoint || 0);
  }

  const costProgressPercent = budget > 0 ? (calculatedCost / budget) * 100 : 0;
  const captureProgressPercent = rainCaptureGoal > 0 ? (calculatedCapture / rainCaptureGoal) * 100 : 0;

  const costContent = (
    <div>
      <SketchAttributesCard autoHide />
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">Budget (USD):</label>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            placeholder="Budget"
            className="styled-input small-input"
          />
        </div>
        <div className="input-group">
          <label className="input-label">Rain Capture Goal (gallons):</label>
          <input
            type="number"
            value={rainCaptureGoalInput}
            onChange={(e) => setRainCaptureGoalInput(e.target.value)}
            placeholder="Rain Capture"
            className="styled-input small-input"
          />
        </div>
      </div>
      <GaugeChart value={costProgressPercent} max={100} title="Budget Spent" />
    </div>
  );

  let contentToRender;
  switch (tab) {
    case "cost":
      contentToRender = costContent;
      break;
    case "capture":
      contentToRender = (
        <CaptureAnalysisPage
          budgetInput={budgetInput}
          setBudgetInput={setBudgetInput}
          rainCaptureGoalInput={rainCaptureGoalInput}
          setRainCaptureGoalInput={setRainCaptureGoalInput}
          captureProgress={captureProgressPercent}
        />
      );
      break;
    case "details":
      contentToRender = (
        <FeatureDetailsPage
          infrastructureType={infrastructureType}
          onAreaCalculated={setArea}
          onLineDimensionsCalculated={setLineLength}
          onPointCountCalculated={setPointCount}
        />
      );
      break;
    default:
      contentToRender = costContent;
  }

  return (
    <div className="viability-page">
      {/* Hidden loader so that calculations run immediately */}
      <CalculationCardsLoader
        infrastructureType={infrastructureType}
        onAreaCalculated={setArea}
        onLineDimensionsCalculated={setLineLength}
        onPointCountCalculated={setPointCount}
      />

      <div className="navbar">
        <button
          className={`navbar-tab ${tab === "cost" ? "active-tab" : ""}`}
          onClick={() => setTab("cost")}
        >
          Cost
        </button>
        <button
          className={`navbar-tab ${tab === "capture" ? "active-tab" : ""}`}
          onClick={() => setTab("capture")}
        >
          Capture
        </button>
        <button
          className={`navbar-tab ${tab === "details" ? "active-tab" : ""}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
      </div>

      <div className="content-section">{contentToRender}</div>
    </div>
  );
};

export default ViabilityPage;
