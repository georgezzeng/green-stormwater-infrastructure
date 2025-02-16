import React, { useState, useEffect } from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import CaptureAnalysis from "./CaptureAnalysis.tsx";
import "../styles/styles.css";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

type TabOption = "cost" | "capture" | "details";

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const [area, setArea] = useState<number | null>(null);
  const [lineLength, setLineLength] = useState<number | null>(null);
  const [pointCount, setPointCount] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [rainCaptureGoal, setRainCaptureGoal] = useState<number | null>(null);
  const [tab, setTab] = useState<TabOption>("cost");

  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  const costContent = (
    <div>
      <SketchAttributesCard autoHide />

      <div className="input-card flex flex-row space-x-4 w-full">
        <label className="flex flex-col w-1/2">
          <span className="text-gray-700 text-sm">Budget (USD):</span>
          <input
            type="number"
            value={budget ?? ""}
            onChange={(e) => setBudget(Number(e.target.value))}
            placeholder="Budget"
            className="styled-input text-sm p-2"
          />
        </label>
        <label className="flex flex-col w-1/2">
          <span className="text-gray-700 text-sm">Rain Capture Goal (gallons):</span>
          <input
            type="number"
            value={rainCaptureGoal ?? ""}
            onChange={(e) => setRainCaptureGoal(Number(e.target.value))}
            placeholder="Rain Capture"
            className="styled-input text-sm p-2"
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
      contentToRender = (
        <FeatureDetailsPage 
          infrastructureType={infrastructureType}
          onAreaCalculated={setArea}
          onLineDimensionsCalculated={(length: number) => setLineLength(length)}
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
