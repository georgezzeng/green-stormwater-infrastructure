import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { infrastructureTypes, InfrastructureConfig } from "../data/infrastructureData.ts";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface InfrastructureChartProps {
  area: number; // Area in square feet
  infrastructureType: keyof typeof infrastructureTypes;
}

const InfrastructureChart: React.FC<InfrastructureChartProps> = ({ area, infrastructureType }) => {
  // Get configuration for the selected infrastructure type
  const config: InfrastructureConfig = infrastructureTypes[infrastructureType];

  // Calculate total values based on area
  const totalCost = area * config.costPerSqFt;
  const capitalCost = area * config.capitalCostPerSqFt;
  const maintenanceCost = area * config.maintenanceCostPerSqFt;
  const totalCapacityIncrease = area * config.capacityIncreasePerSqFt;

  // Data for Cost Breakdown Doughnut Chart
  const costData = {
    labels: ["Capital Cost", "Maintenance Cost"],
    datasets: [
      {
        label: "Cost Breakdown",
        data: [capitalCost, maintenanceCost],
        backgroundColor: ["#4caf50", "#ff9800"],
        hoverBackgroundColor: ["#388e3c", "#f57c00"],
      },
    ],
  };

  // Data for Capacity Increase Bar Chart
  const capacityData = {
    labels: ["Total Capacity Increase"],
    datasets: [
      {
        label: "Capacity (gallons)",
        data: [totalCapacityIncrease],
        backgroundColor: ["#42a5f5"],
        hoverBackgroundColor: ["#1e88e5"],
      },
    ],
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h3>{config.name} Cost Breakdown</h3>
        <Doughnut data={costData} />
        <p>Total Installation Cost: ${totalCost.toFixed(2)}</p>
      </div>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h3>{config.name} Stormwater Capacity Increase</h3>
        <Bar data={capacityData} />
        <p>Total Capacity Increase: {totalCapacityIncrease.toFixed(2)} gallons</p>
      </div>
    </div>
  );
};

export default InfrastructureChart;
