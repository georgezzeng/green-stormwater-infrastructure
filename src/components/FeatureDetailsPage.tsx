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
  onPointCountCalculated,
}) => {
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  // Determine units based on feature type.
  const unit =
    config.category === "polygon"
      ? "per SqFt"
      : config.category === "line"
      ? "per Ft"
      : "per Point";

  return (
    <div>
      <h2 className="centered-h2">{config.name} Details</h2>
      <div className="cards-section">
        {config.category === "collection" ? (
          <>
            {onAreaCalculated && <AreaCard onAreaCalculated={onAreaCalculated} />}
            {onLineDimensionsCalculated && <LineCard onLineDimensionsCalculated={onLineDimensionsCalculated} />}
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
        <table className="details-table">
          <caption>Collection Practice (MIXED TYPES)</caption>
          <thead>
            <tr>
              <th>Practice</th>
              <th>Capital Cost</th>
              <th>Capacity Increase</th>
            </tr>
          </thead>
          <tbody>
            {onAreaCalculated && (
              <tr>
                <td>Polygon (Area)</td>
                <td>
                  {config.capitalCostPerSqFt !== undefined ? config.capitalCostPerSqFt.toFixed(2) : ""}
                  {" per SqFt"}
                </td>
                <td>
                  {config.capacityIncreasePerSqFt !== undefined ? config.capacityIncreasePerSqFt.toFixed(2) : ""}
                  {" per SqFt"}
                </td>
              </tr>
            )}
            {onLineDimensionsCalculated && (
              <tr>
                <td>Line</td>
                <td>
                  {config.capitalCostPerFt !== undefined ? config.capitalCostPerFt.toFixed(2) : ""}
                  {" per Ft"}
                </td>
                <td>
                  {config.capacityIncreasePerFt !== undefined ? config.capacityIncreasePerFt.toFixed(2) : ""}
                  {" per Ft"}
                </td>
              </tr>
            )}
            {onPointCountCalculated && (
              <tr>
                <td>Point</td>
                <td>
                  {config.capitalCostPerPoint !== undefined ? config.capitalCostPerPoint.toFixed(2) : ""}
                  {" per Point"}
                </td>
                <td>
                  {config.capacityIncreasePerPoint !== undefined ? config.capacityIncreasePerPoint.toFixed(2) : ""}
                  {" per Point"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
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
