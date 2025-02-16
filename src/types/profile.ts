export interface DeveloperProfile {
  name: string;
  title: string;
  company: string;
  location: string;
  experience: number;
  specialization: string[];
  investmentPreferences: {
    propertyTypes: string[];
    marketTypes: string[];
    dealSize: {
      min: number;
      max: number;
    };
    targetMarkets: string[];
  };
  investmentThesis: string;
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
  sustainabilityFocus: boolean;
  preferredStructure: string[];
  developmentTypes: string[];
  exitStrategy: string[];
}

export const propertyTypeOptions = [
  "Multi-family",
  "Office",
  "Retail",
  "Industrial",
  "Mixed-use",
  "Hotel",
  "Student Housing",
  "Senior Living",
  "Self-storage",
  "Land Development",
];

export const marketTypeOptions = [
  "Urban Core",
  "Suburban",
  "Secondary Markets",
  "Emerging Markets",
  "Gateway Cities",
  "Tech Hubs",
  "University Towns",
];

export const developmentTypeOptions = [
  "Ground-up Development",
  "Value-Add",
  "Repositioning",
  "Adaptive Reuse",
  "Historic Renovation",
  "Transit-Oriented Development",
];

export const exitStrategyOptions = [
  "Hold Long-term",
  "Sell Post-stabilization",
  "Refinance and Hold",
  "Phased Disposition",
  "Joint Venture Exit",
];

export const structureOptions = [
  "Solo Development",
  "Joint Venture",
  "Fund Investment",
  "Public-Private Partnership",
  "Opportunity Zone",
];
