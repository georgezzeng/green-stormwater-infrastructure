import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface CostVsBudgetBarProps {
  budget: number;
  estimatedCost: number;
}

const CostVsBudgetBar: React.FC<CostVsBudgetBarProps> = ({ budget, estimatedCost }) => {
  const data = {
    labels: ["Estimated Cost", "Budget"],
    datasets: [
      {
        label: "USD",
        data: [estimatedCost, budget],
        backgroundColor: ["#f44336", "#4caf50"],
      },
    ],
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h4>Cost vs. Budget</h4>
      <Bar data={data} />
    </div>
  );
};

export default CostVsBudgetBar;
