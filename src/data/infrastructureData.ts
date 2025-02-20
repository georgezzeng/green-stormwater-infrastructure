export type InfrastructureCategory = "polygon" | "line" | "point" | "collection";

export interface InfrastructureConfig {
  name: string;
  category: InfrastructureCategory;

  // Only for polygons
  capitalCostPerSqFt?: number;
  capacityIncreasePerSqFt?: number;

  // Only for lines
  capitalCostPerFt?: number;
  capacityIncreasePerFt?: number;

  // Only for points
  capitalCostPerPoint?: number;
  capacityIncreasePerPoint?: number;

  capitalCostPerUnit?: number;
  capacityIncreasePerUnit?: number;
}

export const infrastructureTypes: Record<string, InfrastructureConfig> = {
  greenRoof: {
    name: "Green Roof",
    category: "polygon",
    capacityIncreasePerSqFt: 1.4,
    capitalCostPerSqFt: 11.98,
  },
  rainBarrel: {
    name: "Rain Barrel",
    category: "point",
    capacityIncreasePerPoint: 55,
    capitalCostPerPoint: 110,
  },
  cistern: {
    name: "Cistern",
    category: "point",
    capacityIncreasePerPoint: 1000,
    capitalCostPerPoint: 1370,
  },
  drywell: {
    name: "Drywell",
    category: "point",
    capacityIncreasePerPoint: 50,
    capitalCostPerPoint: 250,
  },
  rainGarden: {
    name: "Rain Garden",
    category: "polygon",
    capacityIncreasePerSqFt: 6.3,
    capitalCostPerSqFt: 6.07,
  },
  planterBoxes: {
    name: "Planter Boxes",
    category: "point",
    capacityIncreasePerPoint: 163.1,
    capitalCostPerPoint: 236.5,
  },
  foundationPerimeterDrain: {
    name: "Foundation/Perimeter Drain",
    category: "line",
    capacityIncreasePerFt: 0.7,
    capitalCostPerFt: 45,
  },
  trees: {
    name: "Trees",
    category: "point",
    capacityIncreasePerPoint: 311.2,
    capitalCostPerPoint: 250,
  },
  amendedSoil: {
    name: "Amended Soil",
    category: "polygon",
    capacityIncreasePerSqFt: 1.3,
    capitalCostPerSqFt: 0.29,
  },
  bioSwales: {
    name: "Bio-Swales",
    category: "line",
    capacityIncreasePerFt: 1.1,
    capitalCostPerFt: 17.58,
  },
  urbanFarmingGardening: {
    name: "Urban Farming/Gardening",
    category: "polygon",
    capacityIncreasePerSqFt: 1.5,
    capitalCostPerSqFt: 0.29,
  },
  raisedBed: {
    name: "Raised Bed",
    category: "polygon",
    capacityIncreasePerSqFt: 3.2,
    capitalCostPerSqFt: 9.46,
  },
  vegetationFilterStrip: {
    name: "Vegetation Filter Strip",
    category: "line",
    capacityIncreasePerFt: 8,
    capitalCostPerFt: 0.59,
  },
  nativeVegetation: {
    name: "Native Vegetation",
    category: "polygon",
    capacityIncreasePerSqFt: 1.7,
    capitalCostPerSqFt: 0.19,
  },
  parkingLotSwales: {
    name: "Parking Lot Swales",
    category: "line",
    capacityIncreasePerFt: 2,
    capitalCostPerFt: 36.93,
  },
  roadsideSwales: {
    name: "Roadside Swales",
    category: "line",
    capacityIncreasePerFt: 1.6,
    capitalCostPerFt: 36.93,
  },
  permeablePatio: {
    name: "Permeable Patio",
    category: "polygon",
    capacityIncreasePerSqFt: 1.2,
    capitalCostPerSqFt: 8.68,
  },
  permeableParking: {
    name: "Permeable Parking",
    category: "polygon",
    capacityIncreasePerSqFt: 1.6,
    capitalCostPerSqFt: 8.68,
  },
  permeableSidewalks: {
    name: "Permeable Sidewalks",
    category: "polygon",
    capacityIncreasePerSqFt: 1.2,
    capitalCostPerSqFt: 8.68,
  },
  permeableDriveway: {
    name: "Permeable Driveway",
    category: "polygon",
    capacityIncreasePerSqFt: 1.6,
    capitalCostPerSqFt: 8.68,
  },
  permeableStreets: {
    name: "Permeable Streets",
    category: "polygon",
    capacityIncreasePerSqFt: 1.6,
    capitalCostPerSqFt: 8.68,
  },
  collection: {
    name: "Collection",
    category: "collection", // this new category value distinguishes it from polygon/line/point
    // You may not need cost/capacity factors at the top level for a collection,
    // but if you have defaults for aggregations, you can include them here.
    capitalCostPerUnit: 0,
    capacityIncreasePerUnit: 0,
  },
};
