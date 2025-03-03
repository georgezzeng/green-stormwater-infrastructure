// CaptureAnalysis.tsx
import React, { useEffect } from "react";
import GaugeChart from "./charts/GaugeChart.tsx";
import CollectionBreakdownBarChart from "./charts/BreakdownBarChart.tsx";
import "../styles/styles.css";

interface CaptureAnalysisProps {
  budgetInput: string;
  setBudgetInput: (value: string) => void;
  rainCaptureGoalInput: string;
  setRainCaptureGoalInput: (value: string) => void;
  captureProgress: number;
  // Optional breakdown data from the collection.
  breakdownData?: {
    [practiceKey: string]: {
      count: number;
      total: number;
      details: number[];
      sketchNames: string[];
    };
  };
}

const CaptureAnalysisPage: React.FC<CaptureAnalysisProps> = ({
  budgetInput,
  setBudgetInput,
  rainCaptureGoalInput,
  setRainCaptureGoalInput,
  captureProgress,
  breakdownData = {},
}) => {
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

  return (
    <div className="capture-page">
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
      <GaugeChart value={captureProgress} max={100} title="Capture Progress" />
      {Object.keys(breakdownData).length > 0 && (
        <CollectionBreakdownBarChart analysisMode="capacity" breakdownData={breakdownData} />
      )}
    </div>
  );
};

export default CaptureAnalysisPage;
