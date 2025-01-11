import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { infrastructureTypes } from "../data/infrastructureData.ts";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface InfrastructureComparisonChartProps {
  selectedType: keyof typeof infrastructureTypes;
  area: number;
}

const InfrastructureComparisonChart: React.FC<InfrastructureComparisonChartProps> = ({ selectedType, area }) => {
  const selectedConfig = infrastructureTypes[selectedType];

  const labels = Object.keys(infrastructureTypes);
  const data = {
    labels,
    datasets: [
      {
        label: "Cost (USD)",
        data: labels.map((type) => area * infrastructureTypes[type as keyof typeof infrastructureTypes].costPerSqFt),
        backgroundColor: "#42a5f5",
      },
      {
        label: "Maintenance Cost (USD)",
        data: labels.map((type) => area * infrastructureTypes[type as keyof typeof infrastructureTypes].maintenanceCostPerSqFt),
        backgroundColor: "#ff9800",
      },
      {
        label: "Capacity Increase (Gallons)",
        data: labels.map((type) => area * infrastructureTypes[type as keyof typeof infrastructureTypes].capacityIncreasePerSqFt),
        backgroundColor: "#4caf50",
      },
    ],
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <h4>Comparison with Other Infrastructure Types</h4>
      <Bar data={data} />
    </div>
  );
};

export default InfrastructureComparisonChart;
