import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

interface GaugeChartProps {
  value: number;
  max: number;
  title: string;
  customText?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, max, title, customText }) => {
  const chartRef = useRef<ReactECharts>(null);

  const option = {
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "81%",
        style: {
          text: customText,
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

  useEffect(() => {
    const chartInstance = chartRef.current?.getEchartsInstance();
    if (chartInstance) {
      chartInstance.showLoading({
        text: "Loading...",
        color: "#c23531",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.8)",
      });

      setTimeout(() => {
        chartInstance.hideLoading();
      }, 1000);
    }
  }, [value, max, title, customText]);

  return (
    <ReactECharts
      ref={chartRef}
      option={option}
      style={{ height: "300px", width: "100%" }}
    />
  );
};

export default GaugeChart;
