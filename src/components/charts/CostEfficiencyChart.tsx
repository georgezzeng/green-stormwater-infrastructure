// src/components/charts/CostEfficiencyChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface CostEfficiencyChartProps {
  breakdownData: {
    [practiceKey: string]: {
      total: number;
    };
  };
}

const CostEfficiencyChart: React.FC<CostEfficiencyChartProps> = ({ breakdownData }) => {
  const practiceNames: string[] = [];
  const practiceValues: number[] = [];

  Object.entries(breakdownData)
    // only include items the user actually ran (total > 0)
    .filter(([_, data]) => data.total > 0)
    .forEach(([key, data]) => {
      const cfg = infrastructureTypes[key];
      if (!cfg) return;

      let cost = 0;
      let capture = 0;

      if (cfg.category === "polygon") {
        cost = data.total * (cfg.capitalCostPerSqFt || 0);
        capture = data.total * (cfg.capacityIncreasePerSqFt || 0);
      } else if (cfg.category === "line") {
        cost = data.total * (cfg.capitalCostPerFt || 0);
        capture = data.total * (cfg.capacityIncreasePerFt || 0);
      } else if (cfg.category === "point") {
        cost = data.total * (cfg.capitalCostPerPoint || 0);
        capture = data.total * (cfg.capacityIncreasePerPoint || 0);
      }

      const efficiency = capture > 0 ? cost / capture : 0;
      practiceNames.push(cfg.name);
      practiceValues.push(Number(efficiency.toFixed(2)));
    });

  const yMax = practiceValues.length ? Math.max(...practiceValues) * 1.1 : 1;

  const option = {
    title: {
      text: "Cost Efficiency (USD per gallon)",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.name}: $${p.value.toFixed(2)} / gal`;
      },
    },
    xAxis: {
      type: "category",
      data: practiceNames,
      axisLabel: { interval: 0, rotate: 45 },
    },
    yAxis: {
      type: "value",
      name: "USD / gallon",
      max: yMax,
      axisLabel: { formatter: (val: number) => `$${val}` },
    },
    series: [
      {
        data: practiceValues,
        type: "bar",
        label: {
          show: true,
          position: "top",
          formatter: (p: any) => `$${p.value}`,
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />;
};

export default CostEfficiencyChart;
