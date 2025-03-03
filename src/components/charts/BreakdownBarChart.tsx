import React from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface BreakdownBarChartProps {
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

const BreakdownBarChart: React.FC<BreakdownBarChartProps> = ({
  analysisMode,
  breakdownData,
}) => {
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
    title: {
      text: 'Invidual Practice Breakdown',
      // subtext: 'Optional Subtitle',
      left: 'center'
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params: any) {
        const param = params[0];
        return `${param.name}: ${Math.round(param.value)}`;
      },
    },
    grid: {
      top: 40,
      bottom: 130,
      left: "15%",
      right: "10%",
    },
    xAxis: {
      type: "category",
      data: practiceNames,
      axisLabel: {
        interval: 0,
        rotate: 45, // Or 0 if you have room
      },
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: (val: number) => Math.round(val) },
    },
    dataZoom: [
      {
        type: "slider",
        show: practiceNames.length > 8,
        start: 0,
        end: 100,
        bottom: 1
      },
    ],
    series: [
      {
        data: practiceValues,
        type: "bar",
        label: {
          show: true,
          position: "top",
          formatter: (params: any) => Math.round(params.value),
        },
        itemStyle: {
          color: "#5470C6",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{
        height: "600px",
        width: "100%",     // Make it narrower
        margin: "0 auto"  // Center the chart
      }}
    />
  );
};

export default BreakdownBarChart;
