import React, { useEffect } from "react";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";

interface CaptureAnalysisProps {
  budgetInput: string;
  setBudgetInput: (value: string) => void;
  rainCaptureGoalInput: string;
  setRainCaptureGoalInput: (value: string) => void;
  captureProgress: number;
}

const CaptureAnalysisPage: React.FC<CaptureAnalysisProps> = ({
  budgetInput,
  setBudgetInput,
  rainCaptureGoalInput,
  setRainCaptureGoalInput,
  captureProgress,
}) => {
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
    </div>
  );
};

export default CaptureAnalysisPage;
