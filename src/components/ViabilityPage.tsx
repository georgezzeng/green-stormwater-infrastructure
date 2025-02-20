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
  // Get configuration and check if we're in collection mode.
  const config = infrastructureTypes[infrastructureType];
  const isCollection = config.category === "collection";

  // Single-value states (for non-collection features)
  const [area, setArea] = useState<number>(0);
  const [lineLength, setLineLength] = useState<number>(0);
  const [pointCount, setPointCount] = useState<number>(0);

  // Collection states (arrays)
  const [polygonAreas, setPolygonAreas] = useState<number[]>([]);
  const [lineLengths, setLineLengths] = useState<number[]>([]);
  const [pointCounts, setPointCounts] = useState<number[]>([]);

  // Budget and capture inputs
  const [budgetInput, setBudgetInput] = useState<string>("100");
  const [rainCaptureGoalInput, setRainCaptureGoalInput] = useState<string>("100");
  const [tab, setTab] = useState<TabOption>("cost");

  // Load saved budget and capture goal from localStorage.
  useEffect(() => {
    const storedBudget = localStorage.getItem("budget");
    const storedCapture = localStorage.getItem("rainCaptureGoal");
    if (storedBudget) setBudgetInput(storedBudget);
    if (storedCapture) setRainCaptureGoalInput(storedCapture);
  }, []);

  // Save state changes.
  useEffect(() => {
    localStorage.setItem("budget", budgetInput);
    localStorage.setItem("rainCaptureGoal", rainCaptureGoalInput);
  }, [budgetInput, rainCaptureGoalInput]);

  const budget = parseFloat(budgetInput) || 0;
  const rainCaptureGoal = parseFloat(rainCaptureGoalInput) || 0;

  // Callback handlers with deduplication.
  const handleAreaCalculated = (newArea: number) => {
    console.log("New Area received", newArea);
    if (isCollection) {
      setPolygonAreas((prev) => {
        // Only add if this value isn’t already the last one.
        if (prev.length > 0 && prev[prev.length - 1] === newArea) {
          return prev;
        }
        return [...prev, newArea];
      });
    } else {
      setArea(newArea);
    }
  };

  const handleLineLengthCalculated = (newLength: number) => {
    if (isCollection) {
      setLineLengths((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === newLength) {
          return prev;
        }
        return [...prev, newLength];
      });
    } else {
      setLineLength(newLength);
    }
  };

  const handlePointCountCalculated = (newCount: number) => {
    if (isCollection) {
      setPointCounts((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === newCount) {
          return prev;
        }
        return [...prev, newCount];
      });
    } else {
      setPointCount(newCount);
    }
  };

  // Aggregated totals.
  const totalArea = polygonAreas.reduce((sum, val) => sum + val, 0);
  const totalLineLength = lineLengths.reduce((sum, val) => sum + val, 0);
  const totalPointCount = pointCounts.reduce((sum, val) => sum + val, 0);

  console.log("Polygon Areas:", polygonAreas);
  console.log("Total Area:", totalArea);
  console.log("Line Lengths:", lineLengths);
  console.log("Total Line Length:", totalLineLength);
  console.log("Point Counts:", pointCounts);
  console.log("Total Point Count:", totalPointCount);

  // Estimated cost & capture calculations.
  let calculatedCost = 0;
  let calculatedCapture = 0;

  if (config.category === "polygon") {
    calculatedCost = area * (config.capitalCostPerSqFt || 0);
    calculatedCapture = area * (config.capacityIncreasePerSqFt || 0);
  } else if (config.category === "line") {
    calculatedCost = lineLength * (config.capitalCostPerFt || 0);
    calculatedCapture = lineLength * (config.capacityIncreasePerFt || 0);
  } else if (config.category === "point") {
    calculatedCost = pointCount * (config.capitalCostPerPoint || 0);
    calculatedCapture = pointCount * (config.capacityIncreasePerPoint || 0);
  } else if (config.category === "collection") {
    calculatedCost =
      totalArea * (config.capitalCostPerSqFt || 0) +
      totalLineLength * (config.capitalCostPerFt || 0) +
      totalPointCount * (config.capitalCostPerPoint || 0);
    calculatedCapture =
      totalArea * (config.capacityIncreasePerSqFt || 0) +
      totalLineLength * (config.capacityIncreasePerFt || 0) +
      totalPointCount * (config.capacityIncreasePerPoint || 0);
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
          onAreaCalculated={handleAreaCalculated}
          onLineDimensionsCalculated={handleLineLengthCalculated}
          onPointCountCalculated={handlePointCountCalculated}
        />
      );
      break;
    default:
      contentToRender = costContent;
  }

  return (
    <div className="viability-page">
      {/* Hidden loader to trigger calculations */}
      <CalculationCardsLoader
        infrastructureType={infrastructureType}
        onAreaCalculated={handleAreaCalculated}
        onLineDimensionsCalculated={handleLineLengthCalculated}
        onPointCountCalculated={handlePointCountCalculated}
      />
      <div className="navbar">
        <button className={`navbar-tab ${tab === "cost" ? "active-tab" : ""}`} onClick={() => setTab("cost")}>
          Cost
        </button>
        <button className={`navbar-tab ${tab === "capture" ? "active-tab" : ""}`} onClick={() => setTab("capture")}>
          Capture
        </button>
        <button className={`navbar-tab ${tab === "details" ? "active-tab" : ""}`} onClick={() => setTab("details")}>
          Details
        </button>
      </div>
      <div className="content-section">{contentToRender}</div>
    </div>
  );
};

export default ViabilityPage;
