import React, { useState } from "react";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";
import { AreaCard } from "./cards/AreaCard.tsx";
import { LineCard } from "./cards/LineCard.tsx";
import { PointCard } from "./cards/PointCard.tsx";
import ItemsCountPieChart from "./charts/ItemsCountPieChart.tsx";
import { CollectionCard } from "./cards/CollectionCard.tsx";
import { CollectionResults } from "../functions/calcCollection.ts";

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

  // State to hold collection results.
  const [collectionResults, setCollectionResults] = useState<CollectionResults | null>(null);

  return (
    <div>
      <h2 className="centered-h2">{config.name} Details</h2>
      <div className="cards-section">
        {config.category === "collection" ? (
          <>
            {/* Get the collection data using a callback and hide its UI */}
            <div style={{ display: "none" }}>
              <CollectionCard
                onCollectionCalculated={(results: CollectionResults) => {
                  setCollectionResults(results);
                }}
              />
            </div>
            {/* Display the pie chart if data is available */}
            {collectionResults ? (
              <ItemsCountPieChart breakdownData={collectionResults.breakdown} />
            ) : (
              <p>Loading collection data...</p>
            )}
            {/* Optionally render the individual cards */}
            {onAreaCalculated && <AreaCard onAreaCalculated={onAreaCalculated} />}
            {onLineDimensionsCalculated && (
              <LineCard onLineDimensionsCalculated={onLineDimensionsCalculated} />
            )}
            {onPointCountCalculated && <PointCard onPointCountCalculated={onPointCountCalculated} />}
          </>
        ) : (
          <>
            {config.category === "polygon" && onAreaCalculated && (
              <AreaCard onAreaCalculated={onAreaCalculated} />
            )}
            {config.category === "line" && onLineDimensionsCalculated && (
              <LineCard onLineDimensionsCalculated={onLineDimensionsCalculated} />
            )}
            {config.category === "point" && onPointCountCalculated && (
              <PointCard onPointCountCalculated={onPointCountCalculated} />
            )}
          </>
        )}
      </div>
      {config.category !== "collection" && (
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
