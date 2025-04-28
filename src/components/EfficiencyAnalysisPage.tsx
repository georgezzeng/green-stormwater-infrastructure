import React from "react";
import BreakdownBarChart from "./charts/BreakdownBarChart.tsx";
import CostEfficiencyChart from "./charts/CostEfficiencyChart.tsx";
import CaptureEfficiencyChart from "./charts/CaptureEfficiencyChart.tsx";

interface EfficiencyAnalysisPageProps {
  breakdownData: {
    [practiceKey: string]: {
      total: number;
      count?: number;
      details?: number[];
      sketchNames?: string[];
    };
  };
}

const EfficiencyAnalysisPage: React.FC<EfficiencyAnalysisPageProps> = ({
  breakdownData,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      {/* Combined Cost vs Capture */}
      <BreakdownBarChart analysisMode="both" breakdownData={breakdownData} />

      {/* Individual unit efficiencies */}
      <CostEfficiencyChart breakdownData={breakdownData} />
      <CaptureEfficiencyChart breakdownData={breakdownData} />
    </div>
  );
};

export default EfficiencyAnalysisPage;
