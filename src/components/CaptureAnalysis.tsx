import React from "react";

interface CaptureAnalysisProps {
  budget: number | null;
  setBudget: (value: number) => void;
  rainCaptureGoal: number | null;
  setRainCaptureGoal: (value: number) => void;
}

const CaptureAnalysis: React.FC<CaptureAnalysisProps> = ({
  budget,
  setBudget,
  rainCaptureGoal,
  setRainCaptureGoal,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default CaptureAnalysis;
