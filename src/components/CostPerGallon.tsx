import React from "react";

interface CostPerGallonProps {
  estimatedCost: number;
  capacityIncrease: number;
}

const CostPerGallon: React.FC<CostPerGallonProps> = ({ estimatedCost, capacityIncrease }) => {
  if (capacityIncrease === 0) {
    return <p>Unable to calculate cost per gallon: Capacity increase is zero.</p>;
  }

  const costPerGallon = estimatedCost / capacityIncrease;

  return (
    <div style={{ margin: "1rem 0" }}>
      <h4>Cost Per Gallon Efficiency</h4>
      <p>
        Estimated Cost Per Gallon: <strong>${costPerGallon.toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default CostPerGallon;
