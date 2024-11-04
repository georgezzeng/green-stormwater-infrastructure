export interface InfrastructureConfig {
    name: string;
    costPerSqFt: number;
    capitalCostPerSqFt: number;
    maintenanceCostPerSqFt: number;
    capacityIncreasePerSqFt: number;
  }
  
  export const infrastructureTypes: Record<string, InfrastructureConfig> = {
    greenRoof: {
      name: "Green Roof",
      costPerSqFt: 26,
      capitalCostPerSqFt: 11.98,
      maintenanceCostPerSqFt: 0.75,
      capacityIncreasePerSqFt: 1.4, // in gallons
    },
    rainGarden: {
      name: "Rain Garden",
      costPerSqFt: 14,
      capitalCostPerSqFt: 6.07,
      maintenanceCostPerSqFt: 0.41,
      capacityIncreasePerSqFt: 6.3, // in gallons
    },
    trees: {
      name: "Trees",
      costPerSqFt: 3733,
      capitalCostPerSqFt: 250,
      maintenanceCostPerSqFt: 180,
      capacityIncreasePerSqFt: 311.2, // in gallons
    },
    swale: {
      name: "Swale",
      costPerSqFt: 32,
      capitalCostPerSqFt: 17.58,
      maintenanceCostPerSqFt: 0.26,
      capacityIncreasePerSqFt: 4.2, // in gallons
    },
    permeablePavement: {
      name: "Permeable Pavement",
      costPerSqFt: 13,
      capitalCostPerSqFt: 8.68,
      maintenanceCostPerSqFt: 0.02,
      capacityIncreasePerSqFt: 1.2, // in gallons
    },
  };
  