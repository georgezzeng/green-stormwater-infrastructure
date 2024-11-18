import React from "react";

interface RemainingBudgetIndicatorProps {
  budget: number;
  estimatedCost: number;
}

const RemainingBudgetIndicator: React.FC<RemainingBudgetIndicatorProps> = ({ budget, estimatedCost }) => {
  const remainingBudget = budget - estimatedCost;
  const isWithinBudget = remainingBudget >= 0;

  return (
    <div style={{ margin: "1rem 0" }}>
      <h4>Remaining Budget</h4>
      <p style={{ color: isWithinBudget ? "#4caf50" : "#f44336" }}>
        {isWithinBudget
          ? `You have $${remainingBudget.toFixed(2)} remaining in your budget.`
          : `You exceed your budget by $${Math.abs(remainingBudget).toFixed(2)}.`}
      </p>
    </div>
  );
};

export default RemainingBudgetIndicator;
