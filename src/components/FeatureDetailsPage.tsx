import React from "react";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import { AreaCard } from "./cards/AreaCard.tsx";
import { LineCard } from "./cards/LineCard.tsx";
import { PointCard } from "./cards/PointCard.tsx";

interface FeatureDetailsPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
  onAreaCalculated?: (area: number) => void;
  onLineDimensionsCalculated?: (length: number) => void;
  onPointCountCalculated?: (count: number) => void;
}

const FeatureDetailsPage: React.FC<FeatureDetailsPageProps> = ({ 
  infrastructureType, 
  onAreaCalculated, 
  onLineDimensionsCalculated, 
  onPointCountCalculated 
}) => {
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  return (
    <div>
      <h2>{config.name} Details</h2>
      
      <div className="cards-section">
        {config.category === "polygon" && onAreaCalculated && (
          <AreaCard onAreaCalculated={onAreaCalculated} />
        )}
        {config.category === "line" && onLineDimensionsCalculated && (
          <LineCard onLineDimensionsCalculated={onLineDimensionsCalculated} />
        )}
        {config.category === "point" && onPointCountCalculated && (
          <PointCard onPointCountCalculated={onPointCountCalculated} />
        )}
      </div>
    </div>
  );
};

export default FeatureDetailsPage;
