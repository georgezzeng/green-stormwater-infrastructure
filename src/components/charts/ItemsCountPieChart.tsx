import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { infrastructureTypes } from "../../data/infrastructureData.ts";

interface ItemsCountPieChartProps {
  breakdownData: {
    [practiceKey: string]: {
      count: number;
      total: number;
      details: number[];
      sketchNames: string[];
    };
  };
}

const ItemsCountPieChart: React.FC<ItemsCountPieChartProps> = ({ breakdownData }) => {
  // Transform breakdownData into an array suitable for ECharts.
  const pieData = useMemo(() => {
    return Object.keys(breakdownData).map((practiceKey) => {
      const count = breakdownData[practiceKey].count;
      const practiceName = infrastructureTypes[practiceKey]?.name || practiceKey;
      return { value: count, name: practiceName };
    });
  }, [breakdownData]);

  const option = {
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} items ({d}%)'
    },
    legend: {
        type: 'scroll',  // enables scrollable legend
        orient: 'horizontal',
        top: 'bottom',
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    series: [
      {
        name: 'Count of Each Practice',
        type: 'pie',
        radius: [40, 120],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: pieData
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default ItemsCountPieChart;
