// src/components/GreenRoofChart.tsx

import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface GreenRoofChartProps {
  area: number; // Area in square feet
}

// Cost Constants
const COST_PER_SQFT = 26;
const CAPITAL_COST_PER_SQFT = 11.98;
const MAINTENANCE_COST_PER_SQFT = 0.75;
const CAPACITY_INCREASE_PER_SQFT = 1.4; // in gallons

const GreenRoofChart: React.FC<GreenRoofChartProps> = ({ area }) => {
  // Calculate total values based on area
  const totalCost = area * COST_PER_SQFT;
  const capitalCost = area * CAPITAL_COST_PER_SQFT;
  const maintenanceCost = area * MAINTENANCE_COST_PER_SQFT;
  const totalCapacityIncrease = area * CAPACITY_INCREASE_PER_SQFT;

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
        <h3>Cost Breakdown</h3>
        <Doughnut data={costData} />
        <p>Total Installation Cost: ${totalCost.toFixed(2)}</p>
      </div>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h3>Stormwater Capacity Increase</h3>
        <Bar data={capacityData} />
        <p>Total Capacity Increase: {totalCapacityIncrease.toFixed(2)} gallons</p>
      </div>
    </div>
  );
};

export default GreenRoofChart;
