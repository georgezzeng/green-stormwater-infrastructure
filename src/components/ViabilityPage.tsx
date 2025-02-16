// ViabilityPage.tsx
import React, { useState, useEffect } from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes } from "../data/infrastructureData.ts";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";
import CaptureAnalysisPage from "./CaptureAnalysis.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

type TabOption = "cost" | "capture" | "details";

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const [area, setArea] = useState<number | null>(null);
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [pointCount, setPointCount] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(0);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(0);
  const [tab, setTab] = useState<TabOption>("cost");

  // Load shared state from localStorage on mount
  useEffect(() => {
    const storedBudget = localStorage.getItem("budget");
    const storedCapture = localStorage.getItem("rainCaptureGoal");
    if (storedBudget) setBudget(Number(storedBudget));
    if (storedCapture) setRainCaptureGoal(Number(storedCapture));
  }, []);

  // Save shared state when changed
  useEffect(() => {
    localStorage.setItem("budget", String(budget));
    localStorage.setItem("rainCaptureGoal", String(rainCaptureGoal));
  }, [budget, rainCaptureGoal]);

  // For the cost page, we assume budget represents the progress percentage.
  const budgetProgress = budget ?? 0;

  const costContent = (
    <div>
      <SketchAttributesCard autoHide />
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">Budget (USD):</label>
          <input
            type="number"
            value={budget ?? ""}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="Budget"
            className="styled-input small-input"
          />
        </div>
        <div className="input-group">
          <label className="input-label">Rain Capture Goal (gallons):</label>
          <input
            type="number"
            value={rainCaptureGoal ?? ""}
            onChange={(e) => setRainCaptureGoal(Number(e.target.value))}
            placeholder="Rain Capture"
            className="styled-input small-input"
          />
        </div>
      </div>
      <GaugeChart value={budgetProgress} max={100} title="Budget Spent" />
    </div>
  );

  let contentToRender;
  switch (tab) {
    case "cost":
      contentToRender = costContent;
      break;
    case "capture":
      // For now, reuse costContent if needed. (Alternatively, you could route to the CaptureAnalysisPage.)
      contentToRender = (<CaptureAnalysisPage
        budget={budget}
        setBudget={setBudget}
        rainCaptureGoal={rainCaptureGoal}
        setRainCaptureGoal={setRainCaptureGoal}
      />)
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
