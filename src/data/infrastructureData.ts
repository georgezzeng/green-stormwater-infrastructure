export type InfrastructureCategory = "polygon" | "line" | "point";

export interface InfrastructureConfig {
  name: string;
  category: InfrastructureCategory;
  costPerSqFt: number;
  capitalCostPerSqFt: number;
  maintenanceCostPerSqFt: number;
  capacityIncreasePerSqFt: number;
}

export const infrastructureTypes: Record<string, InfrastructureConfig> = {
  greenRoof: {
    name: "Green Roof",
    category: "polygon",
    costPerSqFt: 26,
    capitalCostPerSqFt: 11.98,
    maintenanceCostPerSqFt: 0.75,
    capacityIncreasePerSqFt: 1.4,
  },
  rainGarden: {
    name: "Rain Garden",
    category: "polygon",
    costPerSqFt: 14,
    capitalCostPerSqFt: 6.07,
    maintenanceCostPerSqFt: 0.41,
    capacityIncreasePerSqFt: 6.3,
  },
  tree: {
    name: "Tree",
    category: "point",
    costPerSqFt: 3733,
    capitalCostPerSqFt: 250,
    maintenanceCostPerSqFt: 180,
    capacityIncreasePerSqFt: 311.2,
  },
  swale: {
    name: "Swale",
    category: "line",
    costPerSqFt: 32,
    capitalCostPerSqFt: 17.58,
    maintenanceCostPerSqFt: 0.26,
    capacityIncreasePerSqFt: 4.2,
  },
  permeablePavement: {
    name: "Permeable Pavement",
    category: "polygon",
    costPerSqFt: 13,
    capitalCostPerSqFt: 8.68,
    maintenanceCostPerSqFt: 0.02,
    capacityIncreasePerSqFt: 1.2,
  },
};
