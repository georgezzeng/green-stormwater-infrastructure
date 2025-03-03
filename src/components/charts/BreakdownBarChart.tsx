// CollectionBreakdownBarChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface CollectionBreakdownBarChartProps {
  analysisMode: "cost" | "capacity";
  breakdownData: {
    [practiceKey: string]: {
      count: number;
      total: number;
      details: number[];
      sketchNames: string[];
    };
  };
}

const BreakdownBarChart: React.FC<CollectionBreakdownBarChartProps> = ({
  analysisMode,
  breakdownData,
}) => {
  // Build arrays for the x-axis (practice names) and y-axis (computed values).
  const practiceNames: string[] = [];
  const practiceValues: number[] = [];

  Object.entries(breakdownData).forEach(([practiceKey, data]) => {
    const config = infrastructureTypes[practiceKey];
    if (!config) return; // Skip if practice not found.
    practiceNames.push(config.name);

    let value = 0;
    if (analysisMode === "cost") {
      if (config.category === "polygon") value = data.total * (config.capitalCostPerSqFt || 0);
      else if (config.category === "line") value = data.total * (config.capitalCostPerFt || 0);
      else if (config.category === "point") value = data.total * (config.capitalCostPerPoint || 0);
    } else if (analysisMode === "capacity") {
      if (config.category === "polygon") value = data.total * (config.capacityIncreasePerSqFt || 0);
      else if (config.category === "line") value = data.total * (config.capacityIncreasePerFt || 0);
      else if (config.category === "point") value = data.total * (config.capacityIncreasePerPoint || 0);
    }
    practiceValues.push(Number(value.toFixed(2)));
  });

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params: any) {
        const param = params[0];
        return `${param.name}: ${param.value.toFixed(2)}`;
      },
    },
    xAxis: {
      type: "category",
      data: practiceNames,
      axisLabel: { interval: 0, rotate: 45 },
    },
    yAxis: { type: "value", axisLabel: { formatter: "{value}" } },
    dataZoom: [{
      type: "slider",
      show: practiceNames.length > 5, // show slider if many practices
      start: 0,
      end: 100,
    }],
    series: [{
      data: practiceValues,
      type: "bar",
      label: { show: true, position: "top", formatter: "{c}" },
      itemStyle: { color: "#5470C6" },
    }],
  };

  return <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />;
};

export default BreakdownBarChart;
