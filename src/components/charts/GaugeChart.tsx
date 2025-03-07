// GaugeChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";

interface GaugeChartProps {
  value: number;
  max: number;
  title: string;
  customText?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, title, customText }) => {
  const option = {
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "81%", // Place below the gauge
        style: {
          text: customText,
          // fontSize: 14,
          // fill: "#333", // text color
        },
      },
    ],
    series: [
      {
        type: "gauge",
        startAngle: 180,
        center: ["50%", "60%"],
        radius: "80%",
        endAngle: 0,
        progress: {
          show: true,
          width: 18,
        },
        pointer: {
          show: true,
          length: "70%",
        },
        axisLine: {
          lineStyle: {
            width: 18,
          },
        },
        axisTick: {
          distance: -25,
          length: 8,
          lineStyle: {
            color: "#999",
            width: 2,
          },
        },
        splitLine: {
          distance: -25,
          length: 20,
          lineStyle: {
            color: "#999",
            width: 1,
          },
        },
        axisLabel: {
          color: "#333",
          distance: -30,
          fontSize: 14,
        },
        detail: {
          valueAnimation: true,
          formatter: (val: number) => `${val.toFixed(1)}%`,
          color: "auto",
          fontSize: 20,
        },
        data: [
          {
            value: value,
            name: title,
          },
        ],
        max: max,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "300px", width: "100%" }} />;
};

export default GaugeChart;
