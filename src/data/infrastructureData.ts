export type InfrastructureCategory = "polygon" | "line" | "point";

export interface InfrastructureConfig {
  name: string;
  category: InfrastructureCategory; // New field for category
  costPerSqFt: number;
  capitalCostPerSqFt: number;
  maintenanceCostPerSqFt: number;
  capacityIncreasePerSqFt: number; // Gallons for polygon/line, gallons per point for points
}

export const infrastructureTypes: Record<string, InfrastructureConfig> = {
  greenRoof: {
    name: "Green Roof",
    category: "polygon", // Polygons
    costPerSqFt: 26,
    capitalCostPerSqFt: 11.98,
    maintenanceCostPerSqFt: 0.75,
    capacityIncreasePerSqFt: 1.4,
  },
  rainGarden: {
    name: "Rain Garden",
    category: "polygon", // Polygons
    costPerSqFt: 14,
    capitalCostPerSqFt: 6.07,
    maintenanceCostPerSqFt: 0.41,
    capacityIncreasePerSqFt: 6.3,
  },
  tree: {
    name: "Tree",
    category: "point", // Points
    costPerSqFt: 3733, // Represents cost per tree
    capitalCostPerSqFt: 250,
    maintenanceCostPerSqFt: 180,
    capacityIncreasePerSqFt: 311.2,
  },
  swale: {
    name: "Swale",
    category: "line", // Lines
    costPerSqFt: 32, // Represents cost per linear foot
    capitalCostPerSqFt: 17.58,
    maintenanceCostPerSqFt: 0.26,
    capacityIncreasePerSqFt: 4.2,
  },
  permeablePavement: {
    name: "Permeable Pavement",
    category: "polygon", // Polygons
    costPerSqFt: 13,
    capitalCostPerSqFt: 8.68,
    maintenanceCostPerSqFt: 0.02,
    capacityIncreasePerSqFt: 1.2,
  },
};
