import React, { useState, useEffect } from "react";
import { AreaCard } from "./cards/AreaCard.tsx";
import { LineCard } from "./cards/LineCard.tsx";
import { PointCard } from "./cards/PointCard.tsx";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import CaptureAnalysis from "./CaptureAnalysis.tsx";
import "../styles/styles.css";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
  featureId: string;
}

type TabOption = "cost" | "capture" | "details";

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType, featureId }) => {
  const [area, setArea] = useState<number | null>(null);
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [pointCount, setPointCount] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(null);
  const [tab, setTab] = useState<TabOption>("cost");

  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(featureId) || "{}");
    if (savedData.budget) setBudget(savedData.budget);
    if (savedData.rainCaptureGoal) setRainCaptureGoal(savedData.rainCaptureGoal);
  }, [featureId]);

  const saveData = () => {
    const data = { budget, rainCaptureGoal };
    localStorage.setItem(featureId, JSON.stringify(data));
  };

  useEffect(() => {
    if (budget !== null && rainCaptureGoal !== null) {
      saveData();
    }
  }, [budget, rainCaptureGoal]);

  const costContent = (
    <div>
      {config.category === "polygon" && <AreaCard onAreaCalculated={setArea} />}
      {config.category === "line" && (
        <LineCard onLineDimensionsCalculated={(length: number) => setLineLength(length)} />
      )}
      {config.category === "point" && <PointCard onPointCountCalculated={setPointCount} />}
      <SketchAttributesCard autoHide />

      <div className="input-card">
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
    </div>
  );

  let contentToRender;
  switch (tab) {
    case "cost":
      contentToRender = costContent;
      break;
    case "capture":
      contentToRender = <CaptureAnalysis />;
      break;
    case "details":
      contentToRender = <FeatureDetailsPage infrastructureType={infrastructureType} />;
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
          Cost Analysis
        </button>
        <button
          className={`navbar-tab ${tab === "capture" ? "active-tab" : ""}`}
          onClick={() => setTab("capture")}
        >
          Capture Analysis
        </button>
        <button
          className={`navbar-tab ${tab === "details" ? "active-tab" : ""}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
      </div>

      <div className="content-section">
        {contentToRender}
      </div>
    </div>
  );
};

export default ViabilityPage;
