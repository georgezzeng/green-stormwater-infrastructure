declare module "echarts-for-react" {
    import * as React from "react";
  
    export interface ReactEChartsProps {
      option: object;
      style?: React.CSSProperties;
      className?: string;
      theme?: string;
      notMerge?: boolean;
      lazyUpdate?: boolean;
      loadingOption?: object;
      showLoading?: boolean;
      onChartReady?: (echartsInstance: any) => void;
      onEvents?: { [key: string]: (params: any, echartsInstance: any) => void };
      opts?: object;
    }
  
    const ReactECharts: React.FC<ReactEChartsProps>;
  
    export default ReactECharts;
  }
  