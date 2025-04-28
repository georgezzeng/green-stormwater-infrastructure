import React from "react";
import FeatureDetailsPage from "./FeatureDetailsPage.tsx";

interface CalculationCardsLoaderProps {
  infrastructureType: string;
  onAreaCalculated: (area: number) => void;
  onLineDimensionsCalculated: (length: number) => void;
  onPointCountCalculated: (count: number) => void;
}

const CalculationCardsLoader: React.FC<CalculationCardsLoaderProps> = ({
  infrastructureType,
  onAreaCalculated,
  onLineDimensionsCalculated,
  onPointCountCalculated,
}) => {
  return (
    <div style={{ display: "none" }}>
      {/* This mounts the FeatureDetailsPage (which renders AreaCard, LineCard, and PointCard)
          offscreen so the calculations run immediately */}
      <FeatureDetailsPage
        infrastructureType={infrastructureType}
        onAreaCalculated={onAreaCalculated}
        onLineDimensionsCalculated={onLineDimensionsCalculated}
        onPointCountCalculated={onPointCountCalculated}
      />
    </div>
  );
};

export default CalculationCardsLoader;
