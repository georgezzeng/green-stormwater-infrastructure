// BreakdownBarChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface BreakdownBarChartProps {
  // "cost" will use the capital cost factor,
  // "capacity" will use the capacity increase factor.
  analysisMode: "cost" | "capacity";
  // This tells the chart which category to show (e.g., only polygon practices if current is polygon)
  currentInfrastructureType: keyof typeof infrastructureTypes;
}

const BreakdownBarChart: React.FC<BreakdownBarChartProps> = ({
  analysisMode,
  currentInfrastructureType,
}) => {
  // Determine the current analysis category from the selected practice.
  const currentConfig = infrastructureTypes[currentInfrastructureType];
  const currentCategory = currentConfig.category;

  // Filter the practices to only those of the same category.
  const filteredPractices = Object.entries(infrastructureTypes).filter(
    ([, conf]) => conf.category === currentCategory
  );

  // Build arrays for the x-axis (practice names) and y-axis (values).
  const practiceNames: string[] = [];
  const practiceValues: number[] = [];

  filteredPractices.forEach(([key, conf]) => {
    practiceNames.push(conf.name);

    let value: number | undefined;
    if (analysisMode === "cost") {
      if (conf.category === "polygon") value = conf.capitalCostPerSqFt;
      else if (conf.category === "line") value = conf.capitalCostPerFt;
      else if (conf.category === "point") value = conf.capitalCostPerPoint;
    } else if (analysisMode === "capacity") {
      if (conf.category === "polygon") value = conf.capacityIncreasePerSqFt;
      else if (conf.category === "line") value = conf.capacityIncreasePerFt;
      else if (conf.category === "point") value = conf.capacityIncreasePerPoint;
    }
    // Ensure we have a number (formatted to 2 decimals) or default to 0.
    practiceValues.push(value !== undefined ? Number(value.toFixed(2)) : 0);
  });

  // ECharts option configuration.
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        // params is an array of data for each series (only one series here)
        const param = params[0];
        return `${param.name}: ${param.value.toFixed(2)}`;
      },
    },
    xAxis: {
      type: "category",
      data: practiceNames,
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}",
      },
    },
    // Enable data zoom if there are many practices.
    dataZoom: [
      {
        type: "slider",
        show: filteredPractices.length > 5, // only show slider if more than 5 practices
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        data: practiceValues,
        type: "bar",
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
        },
        itemStyle: {
          color: "#5470C6",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />;
};

export default BreakdownBarChart;
