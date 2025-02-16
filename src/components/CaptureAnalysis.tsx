// CaptureAnalysisPage.tsx
import React, { useState, useEffect } from "react";
import GaugeChart from "./charts/GaugeChart.tsx";
import "../styles/styles.css";

interface CaptureAnalysisProps {
  budget: number | null;
  setBudget: (value: number) => void;
  rainCaptureGoal: number | null;
  setRainCaptureGoal: (value: number) => void;
}

const CaptureAnalysisPage: React.FC<CaptureAnalysisProps> = ({
  budget,
  setBudget,
  rainCaptureGoal,
  setRainCaptureGoal,
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

  // For the capture page, assume rainCaptureGoal represents the capture progress percentage.
  const captureProgress = rainCaptureGoal ?? 0;

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
      <GaugeChart value={captureProgress} max={200} title="Capture Progress" />
    </div>
  );
};

export default CaptureAnalysisPage;
