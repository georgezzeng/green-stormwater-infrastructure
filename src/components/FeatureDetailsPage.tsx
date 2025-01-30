import React from "react";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";

interface FeatureDetailsPageProps {
  infrastructureType: keyof typeof infrastructureTypes;
}

const FeatureDetailsPage: React.FC<FeatureDetailsPageProps> = ({ infrastructureType }) => {
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  return (
    <div>
      <h2>{config.name} Details</h2>
      <p>Category: {config.category}</p>
      <p>Cost Per Square Foot: ${config.costPerSqFt}</p>
      <p>Capital Cost Per Square Foot: ${config.capitalCostPerSqFt}</p>
      <p>Maintenance Cost Per Square Foot: ${config.maintenanceCostPerSqFt}</p>
      <p>Capacity Increase Per Square Foot: {config.capacityIncreasePerSqFt} gallons</p>
    </div>
  );
};

export default FeatureDetailsPage;
