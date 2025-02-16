export interface ResearchResponse {
  location: string;
  modules: ResearchModule[];
}

export interface ResearchModule {
  moduleName: string;
  moduleDescription: string;
  data:
    | LocationAnalysis
    | MarketConditionsInterface
    | CompetitiveAnalysis
    | RegulatoryEnvironment
    | null;
}

// Location Analysis Module
export interface LocationAnalysis {
  demographicTrends: string;
  developmentActivity: string;
  localAmenities: string;
}

// Market Conditions Module
export interface MarketConditionsInterface {
  priceTrends: string;
  inventoryLevels: string;
  marketTrends: string;
}

// Competitive Analysis Module
export interface CompetitiveAnalysis {
  comparableProperties: string;
  rentalMarket: string;
  propertyFeatures: string;
}

// Regulatory Environment Module
export interface RegulatoryEnvironment {
  zoningRegulations: string;
  buildingPermits: string;
  policyChanges: string;
}

// Type guard for the module data
export function isLocationAnalysis(data: any): data is LocationAnalysis {
  return (
    data &&
    typeof data.demographicTrends === "string" &&
    typeof data.developmentActivity === "string" &&
    typeof data.localAmenities === "string"
  );
}

export function isMarketConditions(
  data: any,
): data is MarketConditionsInterface {
  return (
    data &&
    typeof data.priceTrends === "string" &&
    typeof data.inventoryLevels === "string" &&
    typeof data.marketTrends === "string"
  );
}

export function isCompetitiveAnalysis(data: any): data is CompetitiveAnalysis {
  return (
    data &&
    typeof data.comparableProperties === "string" &&
    typeof data.rentalMarket === "string" &&
    typeof data.propertyFeatures === "string"
  );
}

export function isRegulatoryEnvironment(
  data: any,
): data is RegulatoryEnvironment {
  return (
    data &&
    typeof data.zoningRegulations === "string" &&
    typeof data.buildingPermits === "string" &&
    typeof data.policyChanges === "string"
  );
}
