import React from "react";

interface RainCaptureProgressProps {
  projectedCapacity: number;
  rainCaptureGoal: number;
}

const RainCaptureProgress: React.FC<RainCaptureProgressProps> = ({ projectedCapacity, rainCaptureGoal }) => {
  const progressPercentage = (projectedCapacity / rainCaptureGoal) * 100;

  return (
    <div style={{ margin: "1rem 0" }}>
      <h4>Rain Capture Goal Progress</h4>
      <div style={{ height: "20px", background: "#e0e0e0", borderRadius: "10px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${progressPercentage}%`,
            background: progressPercentage > 100 ? "#f44336" : "#4caf50",
            transition: "width 0.3s",
          }}
        ></div>
      </div>
      <p>{progressPercentage.toFixed(2)}% of goal achieved ({projectedCapacity.toFixed(2)} / {rainCaptureGoal} gallons)</p>
    </div>
  );
};

export default RainCaptureProgress;
