export interface DrugShortageInput {
  drugName: string;
  riskFactors: string[];
  alternatives: Array<{
    name: string;
    price: number;
    availability: string;
  }>;
}

export interface DrugShortageOutput {
  found: boolean;
  drugName: string;
  genericName: string;
  category: string;
  shortageRisk: {
    level: string;
    score: number;
    percentage: string;
    icon: string;
  };
  warning: string;
  daysUntilShortage: number;
  estimatedShortageDate: string;
  pricing: {
    currentPrice: string;
    cheapestAlternative: string;
    monthlySavings: string;
  };
  alternatives: Array<{
    name: string;
    price: number;
    availability: string;
  }>;
  riskFactors: string[];
  recommendations: Array<{
    priority: string;
    action: string;
    details: string;
  }>;
}
