import React from "react";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import { AreaCard } from "./cards/AreaCard.tsx";
import { LineCard } from "./cards/LineCard.tsx";
import { PointCard } from "./cards/PointCard.tsx";

interface FeatureDetailsPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
  // For collection types, pass in the sketch collection object.
  sketch?: any;
  onAreaCalculated?: (area: number) => void;
  onLineDimensionsCalculated?: (length: number) => void;
  onPointCountCalculated?: (count: number) => void;
}

const FeatureDetailsPage: React.FC<FeatureDetailsPageProps> = ({
  infrastructureType,
  sketch,
  onAreaCalculated,
  onLineDimensionsCalculated,
  onPointCountCalculated,
}) => {
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  // Determine unit string based on feature type.
  const unit =
    config.category === "polygon"
      ? "per SqFt"
      : config.category === "line"
      ? "per Ft"
      : "per Point";

  // For collection types, compute a breakdown by practice.
  // We assume that each feature in the collection has a properties.practice field.
  let practiceBreakdown: Record<string, number> = {};
  let collectionPracticeKeys: string[] = [];
  if (config.category === "collection" && sketch && sketch.features) {
    practiceBreakdown = sketch.features.reduce(
      (acc: Record<string, number>, feature: any) => {
        const practiceKey = feature.properties?.practice;
        if (practiceKey) {
          acc[practiceKey] = (acc[practiceKey] || 0) + 1;
        }
        return acc;
      },
      {}
    );
    collectionPracticeKeys = Object.keys(practiceBreakdown);
  }

  return (
    <div>
      <h2 className="centered-h2">{config.name} Details</h2>
      <div className="cards-section">
        {config.category === "collection" ? (
          <>
            {onAreaCalculated && <AreaCard onAreaCalculated={onAreaCalculated} />}
            {onLineDimensionsCalculated && (
              <LineCard onLineDimensionsCalculated={onLineDimensionsCalculated} />
            )}
            {onPointCountCalculated && <PointCard onPointCountCalculated={onPointCountCalculated} />}
          </>
        ) : (
          <>
            {config.category === "polygon" && onAreaCalculated && <AreaCard onAreaCalculated={onAreaCalculated} />}
            {config.category === "line" && onLineDimensionsCalculated && <LineCard onLineDimensionsCalculated={onLineDimensionsCalculated} />}
            {config.category === "point" && onPointCountCalculated && <PointCard onPointCountCalculated={onPointCountCalculated} />}
          </>
        )}
      </div>
      {config.category === "collection" ? (
        // When a collection is passed, show one row per practice found in the sketch collection.
        <table className="details-table">
          <caption>Collection Practice (MIXED TYPES)</caption>
          <thead>
            <tr>
              <th>Practice</th>
              <th>Capital Cost</th>
              <th>Capacity Increase</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {collectionPracticeKeys.map((practiceKey) => {
              const practiceConfig = infrastructureTypes[practiceKey];
              return (
                <tr key={practiceKey}>
                  <td>{practiceConfig.name}</td>
                  <td>
                    {practiceConfig.category === "polygon" && practiceConfig.capitalCostPerSqFt !== undefined
                      ? practiceConfig.capitalCostPerSqFt.toFixed(2)
                      : practiceConfig.category === "line" && practiceConfig.capitalCostPerFt !== undefined
                      ? practiceConfig.capitalCostPerFt.toFixed(2)
                      : practiceConfig.category === "point" && practiceConfig.capitalCostPerPoint !== undefined
                      ? practiceConfig.capitalCostPerPoint.toFixed(2)
                      : "-----"}{" "}
                    per {practiceConfig.category === "polygon" ? "SqFt" : practiceConfig.category === "line" ? "Ft" : "Point"}
                  </td>
                  <td>
                    {practiceConfig.category === "polygon" && practiceConfig.capacityIncreasePerSqFt !== undefined
                      ? practiceConfig.capacityIncreasePerSqFt.toFixed(2)
                      : practiceConfig.category === "line" && practiceConfig.capacityIncreasePerFt !== undefined
                      ? practiceConfig.capacityIncreasePerFt.toFixed(2)
                      : practiceConfig.category === "point" && practiceConfig.capacityIncreasePerPoint !== undefined
                      ? practiceConfig.capacityIncreasePerPoint.toFixed(2)
                      : "-----"}{" "}
                    per {practiceConfig.category === "polygon" ? "SqFt" : practiceConfig.category === "line" ? "Ft" : "Point"}
                  </td>
                  <td>{practiceBreakdown[practiceKey]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        // Non-collection table (for polygon, line, or point)
        <table className="details-table">
          <caption>Infrastructure Practice ({config.category.toUpperCase()})</caption>
          <thead>
            <tr>
              <th>Practice</th>
              <th>Capital Cost</th>
              <th>Capacity Increase</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{config.name}</td>
              <td>
                {config.category === "polygon" && config.capitalCostPerSqFt !== undefined
                  ? config.capitalCostPerSqFt.toFixed(2)
                  : config.category === "line" && config.capitalCostPerFt !== undefined
                  ? config.capitalCostPerFt.toFixed(2)
                  : config.capitalCostPerPoint !== undefined
                  ? config.capitalCostPerPoint.toFixed(2)
                  : ""}
                {" "}{unit}
              </td>
              <td>
                {config.category === "polygon" && config.capacityIncreasePerSqFt !== undefined
                  ? config.capacityIncreasePerSqFt.toFixed(2)
                  : config.category === "line" && config.capacityIncreasePerFt !== undefined
                  ? config.capacityIncreasePerFt.toFixed(2)
                  : config.capacityIncreasePerPoint !== undefined
                  ? config.capacityIncreasePerPoint.toFixed(2)
                  : ""}
                {" "}{unit}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeatureDetailsPage;
