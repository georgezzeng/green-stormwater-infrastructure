// src/components/charts/CaptureEfficiencyChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface CaptureEfficiencyChartProps {
  breakdownData: {
    [practiceKey: string]: {
      total: number;
    };
  };
}

const CaptureEfficiencyChart: React.FC<CaptureEfficiencyChartProps> = ({ breakdownData }) => {
  const practiceNames: string[] = [];
  const practiceValues: number[] = [];

  Object.entries(breakdownData)
    // only include items the user actually ran (total > 0)
    .filter(([_, data]) => data.total > 0)
    .forEach(([key, data]) => {
      const cfg = infrastructureTypes[key];
      if (!cfg) return;

      let efficiency = 0;
      if (cfg.category === "polygon") {
        efficiency = cfg.capacityIncreasePerSqFt || 0;
      } else if (cfg.category === "line") {
        efficiency = cfg.capacityIncreasePerFt || 0;
      } else if (cfg.category === "point") {
        efficiency = cfg.capacityIncreasePerPoint || 0;
      }

      practiceNames.push(cfg.name);
      practiceValues.push(Number(efficiency.toFixed(2)));
    });

  const yMax = practiceValues.length ? Math.max(...practiceValues) * 1.1 : 1;

  const option = {
    title: {
      text: "Capture Efficiency (gallons per unit)",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.name}: ${p.value.toFixed(2)} gal/unit`;
      },
    },
    xAxis: {
      type: "category",
      data: practiceNames,
      axisLabel: { interval: 0, rotate: 45 },
    },
    yAxis: {
      type: "value",
      name: "Gallons / unit",
      max: yMax,
    },
    series: [
      {
        data: practiceValues,
        type: "bar",
        label: {
          show: true,
          position: "top",
          formatter: (p: any) => `${p.value}`,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />;
};

export default CaptureEfficiencyChart;
