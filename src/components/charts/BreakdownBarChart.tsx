import React from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface BreakdownBarChartProps {
  analysisMode: "cost" | "capacity" | "both";
  breakdownData: {
    [practiceKey: string]: {
      count: number;
      total: number;
      details: number[];
      sketchNames: string[];
    };
  };
  totalGoal?: number;
}

const BreakdownBarChart: React.FC<BreakdownBarChartProps> = ({
  analysisMode,
  breakdownData,
  totalGoal = 0,
}) => {
  if (analysisMode === "both") {
    const practiceNames: string[] = [];
    const costValues: number[] = [];
    const captureValues: number[] = [];

    Object.entries(breakdownData)
      .filter(([, data]) => data.total > 0)
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

        practiceNames.push(cfg.name);
        costValues.push(Number(cost.toFixed(2)));
        captureValues.push(Number(capture.toFixed(2)));
      });

    const maxCost = costValues.length ? Math.max(...costValues) * 1.1 : 1;
    const maxCap = captureValues.length ? Math.max(...captureValues) * 1.1 : 1;

    const option = {
      title: {
        text: "Cost vs Capture Breakdown",
        left: "center",
      },
      tooltip: {
        trigger: "axis" as const,
        axisPointer: { type: "shadow" as const },
        formatter: (params: any) => {
          const costParam = params[0];
          const capParam = params[1];
          return `
            ${costParam.name}<br/>
            Cost: $${costParam.value.toFixed(2)}<br/>
            Capture: ${capParam.value.toFixed(2)} gal
          `;
        },
      },
      legend: {
        data: ["Cost (USD)", "Capture (gal)"],
        top: 30,
      },
      xAxis: {
        type: "category" as const,
        data: practiceNames,
        axisLabel: { interval: 0, rotate: 45 },
      },
      yAxis: [
        {
          type: "value" as const,
          name: "USD",
          position: "left" as const,
          max: maxCost,
          axisLabel: { formatter: (val: number) => `$${val}` },
        },
        {
          type: "value" as const,
          name: "Gallons",
          position: "right" as const,
          max: maxCap,
        },
      ],
      toolbox: {
        show: true,
        feature: {
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: [
        {
          name: "Cost (USD)",
          type: "bar" as const,
          data: costValues,
        },
        {
          name: "Capture (gal)",
          type: "bar" as const,
          yAxisIndex: 1,
          data: captureValues,
        },
      ],
      grid: {
        top: 80,
        bottom: 130,
        left: "10%",
        right: "10%",
      },
    };

    return <ReactECharts option={option} style={{ height: "500px", width: "100%" }} />;
  }

  const practiceNames: string[] = [];
  const practiceValues: number[] = [];

  Object.entries(breakdownData).forEach(([key, data]) => {
    const cfg = infrastructureTypes[key];
    if (!cfg) return;
    let val = 0;
    if (analysisMode === "cost") {
      if (cfg.category === "polygon") val = data.total * (cfg.capitalCostPerSqFt || 0);
      else if (cfg.category === "line") val = data.total * (cfg.capitalCostPerFt || 0);
      else if (cfg.category === "point") val = data.total * (cfg.capitalCostPerPoint || 0);
    } else {
      if (cfg.category === "polygon") val = data.total * (cfg.capacityIncreasePerSqFt || 0);
      else if (cfg.category === "line") val = data.total * (cfg.capacityIncreasePerFt || 0);
      else if (cfg.category === "point") val = data.total * (cfg.capacityIncreasePerPoint || 0);
    }
    practiceNames.push(cfg.name);
    practiceValues.push(Number(val.toFixed(2)));
  });

  const yAxisMax = Math.max(...practiceValues, totalGoal) * 1.1;

  const option = {
    title: {
      text:
        analysisMode === "cost"
          ? "Individual Practice Cost Breakdown"
          : "Individual Practice Capture Breakdown",
      left: "center",
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    tooltip: {
      trigger: "axis" as const,
      axisPointer: { type: "shadow" as const },
      formatter: (params: any) => {
        const p = params[0];
        const pct = totalGoal > 0 ? (p.value / totalGoal) * 100 : 0;
        const lbl = analysisMode === "cost" ? "Budget" : "Capture Goal";
        return `${p.name}: ${p.value}<br/>(${pct.toFixed(2)}% of ${lbl})`;
      },
    },
    grid: {
      top: 40,
      bottom: 130,
      left: "15%",
      right: "10%",
    },
    xAxis: {
      type: "category" as const,
      data: practiceNames,
      axisLabel: { interval: 0, rotate: 45 },
    },
    yAxis: {
      type: "value" as const,
      max: yAxisMax,
      axisLabel: { formatter: (val: number) => Math.round(val) },
    },
    series: [
      {
        data: practiceValues,
        type: "bar" as const,
        label: {
          show: true,
          position: "top" as const,
          formatter: (p: any) => Math.round(p.value),
        },
        markLine:
          analysisMode !== "both"
            ? {
                data: [{ yAxis: totalGoal }],
                lineStyle: { color: "red", type: "dotted", width: 2 },
                label: {
                  formatter: analysisMode === "cost" ? "Budget" : "Capture\nGoal",
                  position: "end" as const,
                  color: "red",
                },
              }
            : undefined,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "500px", width: "100%" }} />;
};

export default BreakdownBarChart;
