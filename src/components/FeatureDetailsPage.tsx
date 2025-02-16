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

  // Only display practices of the same category as the current analysis.
  const filteredPractices = Object.entries(infrastructureTypes).filter(
    ([, conf]) => conf.category === config.category
  );

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

      <table className="details-table">
        <caption>Infrastructure Practices ({config.category.toUpperCase()})</caption>
        <thead>
          <tr>
            <th>Practice</th>
            <th>Capital Cost</th>
            <th>Capacity Increase</th>
          </tr>
        </thead>
        <tbody>
          {filteredPractices.map(([key, conf]) => {
            let capitalCost, capacityIncrease, unit;
            if (conf.category === "polygon") {
              capitalCost = conf.capitalCostPerSqFt;
              capacityIncrease = conf.capacityIncreasePerSqFt;
              unit = "per SqFt";
            } else if (conf.category === "line") {
              capitalCost = conf.capitalCostPerFt;
              capacityIncrease = conf.capacityIncreasePerFt;
              unit = "per Ft";
            } else if (conf.category === "point") {
              capitalCost = conf.capitalCostPerPoint;
              capacityIncrease = conf.capacityIncreasePerPoint;
              unit = "per Point";
            }
            return (
              <tr key={key}>
                <td>{conf.name}</td>
                <td>{capitalCost} {unit}</td>
                <td>{capacityIncrease} {unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureDetailsPage;
