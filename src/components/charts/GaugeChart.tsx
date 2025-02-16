// GaugeChart.tsx
import React from "react";
import ReactECharts from "echarts-for-react";

interface GaugeChartProps {
  value: number;
  max: number;
  title: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, title }) => {
  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 180,
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
            width: 4,
          },
        },
        axisLabel: {
          color: "#333",
          distance: -30,
          fontSize: 14,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
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
