import React, { useEffect, useState } from "react";
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
  const [rainCaptureError, setRainCaptureError] = useState<string>("");

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
          <label className="input-label">Rain Capture Goal (gallons):</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={rainCaptureGoalInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value !== "") {
                const numValue = parseFloat(value);
                if (numValue < 0) {
                  setRainCaptureError("Please enter a positive value");
                } else if (value.indexOf(".") > -1) {
                  const decimals = value.split(".")[1];
                  if (decimals.length > 2) {
                    setRainCaptureError("Please keep decimals to two places or less");
                  } else {
                    setRainCaptureError("");
                  }
                } else {
                  setRainCaptureError("");
                }
              } else {
                setRainCaptureError("");
              }
              setRainCaptureGoalInput(value);
            }}
            placeholder="Rain Capture"
            className="styled-input"
          />
          {rainCaptureError && <div className="error-message" style={{ color: "red" }}>{rainCaptureError}</div>}
        </div>
      </div>
      <GaugeChart 
        value={captureProgress} 
        max={100} 
        title="Capture Progress" 
        customText={`${Math.round(actualCapture)} / ${Math.round(captureGoal)} gallons captured`} 
      />
      {Object.keys(breakdownData).length > 0 && (
        <BreakdownBarChart analysisMode="capacity" breakdownData={breakdownData} totalGoal={captureGoal} />
      )}
    </div>
  );
};

export default CaptureAnalysisPage;
