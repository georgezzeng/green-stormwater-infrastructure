// CaptureAnalysisPage.tsx
import React, { useEffect } from "react";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";

interface CaptureAnalysisProps {
  budget: number | null;
  setBudget: (value: number) => void;
  rainCaptureGoal: number | null;
  setRainCaptureGoal: (value: number) => void;
  // New prop for computed capture progress percentage
  captureProgress: number;
}

const CaptureAnalysisPage: React.FC<CaptureAnalysisProps> = ({
  budget,
  setBudget,
  rainCaptureGoal,
  setRainCaptureGoal,
  captureProgress,
}) => {
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

  return (
    <div className="capture-page">
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
      {/* Updated gauge now uses the computed capture progress */}
      <GaugeChart value={captureProgress} max={100} title="Capture Progress" />
    </div>
  );
};

export default CaptureAnalysisPage;
