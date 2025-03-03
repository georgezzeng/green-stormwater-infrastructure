
import React, { useEffect } from "react";
import GaugeChart from "./charts/GaugeChart.tsx";
import BreakdownBarChart from "./charts/BreakdownBarChart.tsx";
import "../styles/styles.css";

interface CaptureAnalysisProps {
  budgetInput: string;
  setBudgetInput: (value: string) => void;
  rainCaptureGoalInput: string;
  setRainCaptureGoalInput: (value: string) => void;
  captureProgress: number;
  actualCapture: number;
  captureGoal: number;
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
  actualCapture,
  captureGoal,
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
      <GaugeChart 
        value={captureProgress} 
        max={100} 
        title="Capture Progress" 
        customText={`${Math.round(actualCapture)} / ${Math.round(captureGoal)} captured`} 
      />
      {Object.keys(breakdownData).length > 0 && (
        <BreakdownBarChart analysisMode="capacity" breakdownData={breakdownData} totalGoal={captureGoal} />
      )}
    </div>
  );
};

export default CaptureAnalysisPage;
