
import React, { useState, useEffect } from "react";
import { SketchAttributesCard } from "@seasketch/geoprocessing/client-ui";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";
import CaptureAnalysisPage from "./CaptureAnalysis.tsx";
import CalculationCardsLoader from "./CalculationCardsLoader.tsx";
import { CollectionCard } from "./cards/CollectionCard.tsx";
import { CollectionResults } from "../functions/calcCollection.ts";
import BreakdownBarChart from "./charts/BreakdownBarChart.tsx";

interface ViabilityPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

type TabOption = "cost" | "capture" | "details";

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
  const [tab, setTab] = useState<TabOption>("cost");

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

  const handleAreaCalculated = (newArea: number) => {
    console.log("New Area received", newArea);
    if (isCollection) {
      setPolygonAreas((prev) => (prev.length > 0 && prev[prev.length - 1] === newArea ? prev : [...prev, newArea]));
    } else {
      setArea(newArea);
    }
  };

  const handleLineLengthCalculated = (newLength: number) => {
    if (isCollection) {
      setLineLengths((prev) => (prev.length > 0 && prev[prev.length - 1] === newLength ? prev : [...prev, newLength]));
    } else {
      setLineLength(newLength);
    }
  };

  const handlePointCountCalculated = (newCount: number) => {
    if (isCollection) {
      setPointCounts((prev) => (prev.length > 0 && prev[prev.length - 1] === newCount ? prev : [...prev, newCount]));
    } else {
      setPointCount(newCount);
    }
  };

  const totalArea = polygonAreas.reduce((sum, val) => sum + val, 0);
  const totalLineLength = lineLengths.reduce((sum, val) => sum + val, 0);
  const totalPointCount = pointCounts.reduce((sum, val) => sum + val, 0);

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
  } else if (config.category === "collection" && collectionResults) {
    Object.entries(collectionResults.breakdown).forEach(([practiceKey, data]) => {
      const practiceConfig = infrastructureTypes[practiceKey];
      if (practiceConfig) {
        if (practiceConfig.category === "polygon" && practiceConfig.capitalCostPerSqFt !== undefined) {
          calculatedCost += data.total * practiceConfig.capitalCostPerSqFt;
          calculatedCapture += data.total * (practiceConfig.capacityIncreasePerSqFt || 0);
        } else if (practiceConfig.category === "line" && practiceConfig.capitalCostPerFt !== undefined) {
          calculatedCost += data.total * practiceConfig.capitalCostPerFt;
          calculatedCapture += data.total * (practiceConfig.capacityIncreasePerFt || 0);
        } else if (practiceConfig.category === "point" && practiceConfig.capitalCostPerPoint !== undefined) {
          calculatedCost += data.total * practiceConfig.capitalCostPerPoint;
          calculatedCapture += data.total * (practiceConfig.capacityIncreasePerPoint || 0);
        }
      }
    });
  }

  const costProgressPercent = budget > 0 ? (calculatedCost / budget) * 100 : 0;
  const captureProgressPercent = rainCaptureGoal > 0 ? (calculatedCapture / rainCaptureGoal) * 100 : 0;

  // Cost tab content now includes the gauge and (if collection results exist) the breakdown bar chart.
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
      <GaugeChart value={costProgressPercent} max={100} title="Budget Spent" customText={`$${Math.round(calculatedCost)} / $${Math.round(budget)} spent`} />
      {isCollection && collectionResults && (
        <BreakdownBarChart analysisMode="cost" breakdownData={collectionResults.breakdown} />
      )}
    </div>
  );

  // In the capture tab, we use a similar pattern.
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

  let contentToRender;
  switch (tab) {
    case "cost":
      contentToRender = costContent;
      break;
    case "capture":
      contentToRender = captureContent;
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
      <div className="content-section">
        {contentToRender}
        {isCollection && (
          <div style={{ display: "none" }}>
            <CollectionCard
              onCollectionCalculated={(results: CollectionResults) => {
                console.log("Collection breakdown:", results);
                setCollectionResults(results);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViabilityPage;
