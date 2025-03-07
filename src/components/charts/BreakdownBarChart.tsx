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
  totalGoal: number;
}

const BreakdownBarChart: React.FC<BreakdownBarChartProps> = ({
  analysisMode,
  breakdownData,
  totalGoal
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
  const yAxisMax = Math.max(...practiceValues, totalGoal) * 1.1;

  const option = {
    title: {
      text: 'Invidual Practice Breakdown',
      // subtext: 'Optional Subtitle',
      left: 'center'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params: any) {
        const param = params[0];
        const percentage =
          totalGoal > 0 ? (param.value / totalGoal) * 100 : 0;
        const label = analysisMode === "cost" ? "Budget" : "Capture Goal";
        return `${param.name}: ${param.value.toFixed(2)}<br/>(${percentage.toFixed(2)}% of ${label})`;
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
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      max: yAxisMax,
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
        markLine: {
          data: [{ yAxis: totalGoal }],
          lineStyle: {
            color: "red",
            type: "dotted",
            width: 2,
          },
          label: {
            formatter: () => analysisMode === "cost" ? "Budget" : "Capture\nGoal",
            position: "end",
            color: "red",
          },
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
        width: "100%",    
        margin: "0 auto"
      }}
    />
  );
};

export default BreakdownBarChart;
