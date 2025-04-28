import React, { useState, useEffect } from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";
import CaptureAnalysisPage from "./CaptureAnalysisPage.tsx";
import CalculationCardsLoader from "./CalculationCardsLoader.tsx";
import { CollectionCard } from "./cards/CollectionCard.tsx";
import { CollectionResults } from "../functions/calcCollection.ts";
import BreakdownBarChart from "./charts/BreakdownBarChart.tsx";
import EfficiencyAnalysisPage from "./EfficiencyAnalysisPage.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

type TabOption = "cost" | "capture" | "details" | "efficiency";

export const ViabilityPage: React.FC<ViabilityPageProps> = ({ infrastructureType }) => {
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];
  const isCollection = config.category === "collection";

  // Single-value states (non-collection)
  const [area, setArea] = useState<number>(0);
  const [lineLength, setLineLength] = useState<number>(0);
  const [pointCount, setPointCount] = useState<number>(0);

  // Collection states (arrays)
  const [polygonAreas, setPolygonAreas] = useState<number[]>([]);
  const [lineLengths, setLineLengths] = useState<number[]>([]);
  const [pointCounts, setPointCounts] = useState<number[]>([]);

  // State to capture collection breakdown results.
  const [collectionResults, setCollectionResults] = useState<CollectionResults | null>(null);

  // Budget and capture inputs.
  const [budgetInput, setBudgetInput] = useState<string>("100");
  const [rainCaptureGoalInput, setRainCaptureGoalInput] = useState<string>("100");

  // Default to "capture" tab
  const [tab, setTab] = useState<TabOption>("capture");

  // Budget validation error
  const [budgetError, setBudgetError] = useState<string>("");

  useEffect(() => {
    const storedBudget = localStorage.getItem("budget");
    const storedCapture = localStorage.getItem("rainCaptureGoal");
    if (storedBudget) setBudgetInput(storedBudget);
    if (storedCapture) setRainCaptureGoalInput(storedCapture);
  }, []);

  useEffect(() => {
    localStorage.setItem("budget", budgetInput);
    localStorage.setItem("rainCaptureGoal", rainCaptureGoalInput);
  }, [budgetInput, rainCaptureGoalInput]);

  const budget = parseFloat(budgetInput) || 0;
  const rainCaptureGoal = parseFloat(rainCaptureGoalInput) || 0;

  // Handlers for the hidden CalculationCardsLoader
  const handleAreaCalculated = (newArea: number) => {
    if (isCollection) {
      setPolygonAreas(prev =>
        prev.length > 0 && prev[prev.length - 1] === newArea ? prev : [...prev, newArea]
      );
    } else {
      setArea(newArea);
    }
  };
  const handleLineLengthCalculated = (newLength: number) => {
    if (isCollection) {
      setLineLengths(prev =>
        prev.length > 0 && prev[prev.length - 1] === newLength ? prev : [...prev, newLength]
      );
    } else {
      setLineLength(newLength);
    }
  };
  const handlePointCountCalculated = (newCount: number) => {
    if (isCollection) {
      setPointCounts(prev =>
        prev.length > 0 && prev[prev.length - 1] === newCount ? prev : [...prev, newCount]
      );
    } else {
      setPointCount(newCount);
    }
  };

  // Totals for collections
  const totalArea = polygonAreas.reduce((sum, v) => sum + v, 0);
  const totalLineLength = lineLengths.reduce((sum, v) => sum + v, 0);
  const totalPointCount = pointCounts.reduce((sum, v) => sum + v, 0);

  // Calculate cost & capture
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
  } else if (config.category === "collection" && collectionResults) {
    Object.entries(collectionResults.breakdown).forEach(([key, data]) => {
      const cfg = infrastructureTypes[key];
      if (!cfg) return;
      if (cfg.category === "polygon") {
        calculatedCost += data.total * (cfg.capitalCostPerSqFt || 0);
        calculatedCapture += data.total * (cfg.capacityIncreasePerSqFt || 0);
      } else if (cfg.category === "line") {
        calculatedCost += data.total * (cfg.capitalCostPerFt || 0);
        calculatedCapture += data.total * (cfg.capacityIncreasePerFt || 0);
      } else if (cfg.category === "point") {
        calculatedCost += data.total * (cfg.capitalCostPerPoint || 0);
        calculatedCapture += data.total * (cfg.capacityIncreasePerPoint || 0);
      }
    });
  }

  const costProgressPercent = budget > 0 ? (calculatedCost / budget) * 100 : 0;
  const captureProgressPercent = rainCaptureGoal > 0 ? (calculatedCapture / rainCaptureGoal) * 100 : 0;

  // **Build the "breakdownData" passed into EfficiencyAnalysisPage**
  const efficiencyBreakdown: Record<string, {
    total: number;
    count?: number;
    details?: number[];
    sketchNames?: string[];
  }> = isCollection
    ? collectionResults?.breakdown || {}
    : {
        [infrastructureType]: {
          total:
            config.category === "polygon"
              ? area
              : config.category === "line"
              ? lineLength
              : pointCount,
        },
      };

  // --- Tab contents ---
  const costContent = (
    <div>
      <SketchAttributesCard autoHide />
      <div className="input-row">
        <div className="input-group">
          <label className="input-label">Budget (USD):</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={budgetInput}
            onChange={e => {
              const v = e.target.value;
              if (v !== "") {
                const n = parseFloat(v);
                if (n < 0) setBudgetError("Value cannot be negative");
                else if (v.includes(".") && v.split(".")[1].length > 2)
                  setBudgetError("Only two decimals allowed");
                else setBudgetError("");
              } else {
                setBudgetError("");
              }
              setBudgetInput(v);
            }}
            placeholder="Budget"
            className="styled-input"
          />
          {budgetError && <div className="error-message">{budgetError}</div>}
        </div>
      </div>
      <GaugeChart
        value={costProgressPercent}
        max={100}
        title="Budget Spent"
        customText={`$${Math.round(calculatedCost)} / $${Math.round(budget)} spent`}
      />
      {isCollection && collectionResults && (
        <BreakdownBarChart
          analysisMode="cost"
          breakdownData={collectionResults.breakdown}
          totalGoal={budget}
        />
      )}
    </div>
  );

  const captureContent = (
    <CaptureAnalysisPage
      budgetInput={budgetInput}
      setBudgetInput={setBudgetInput}
      rainCaptureGoalInput={rainCaptureGoalInput}
      setRainCaptureGoalInput={setRainCaptureGoalInput}
      captureProgress={captureProgressPercent}
      actualCapture={calculatedCapture}
      captureGoal={rainCaptureGoal}
      breakdownData={isCollection && collectionResults ? collectionResults.breakdown : {}}
    />
  );

  const detailsContent = (
    <FeatureDetailsPage
      infrastructureType={infrastructureType}
      onAreaCalculated={handleAreaCalculated}
      onLineDimensionsCalculated={handleLineLengthCalculated}
      onPointCountCalculated={handlePointCountCalculated}
    />
  );

  const efficiencyContent = (
    <EfficiencyAnalysisPage breakdownData={efficiencyBreakdown} />
  );

  let contentToRender;
  switch (tab) {
    case "capture":
      contentToRender = captureContent;
      break;
    case "cost":
      contentToRender = costContent;
      break;
    case "details":
      contentToRender = detailsContent;
      break;
    case "efficiency":
      contentToRender = efficiencyContent;
      break;
    default:
      contentToRender = captureContent;
  }

  return (
    <div className="viability-page">
      <CalculationCardsLoader
        infrastructureType={infrastructureType}
        onAreaCalculated={handleAreaCalculated}
        onLineDimensionsCalculated={handleLineLengthCalculated}
        onPointCountCalculated={handlePointCountCalculated}
      />
      <div className="navbar">
        <button
          className={`navbar-tab ${tab === "capture" ? "active-tab" : ""}`}
          onClick={() => setTab("capture")}
        >
          Capture
        </button>
        <button
          className={`navbar-tab ${tab === "cost" ? "active-tab" : ""}`}
          onClick={() => setTab("cost")}
        >
          Cost
        </button>
        <button
          className={`navbar-tab ${tab === "details" ? "active-tab" : ""}`}
          onClick={() => setTab("details")}
        >
          Details
        </button>
        <button
          className={`navbar-tab ${tab === "efficiency" ? "active-tab" : ""}`}
          onClick={() => setTab("efficiency")}
        >
          Efficiency
        </button>
      </div>
      <div className="content-section">{contentToRender}</div>
      {isCollection && (
        <div style={{ display: "none" }}>
          <CollectionCard
            onCollectionCalculated={setCollectionResults}
          />
        </div>
      )}
    </div>
  );
};

export default ViabilityPage;
