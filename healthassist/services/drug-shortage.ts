import { DrugShortageInput, DrugShortageOutput } from "../types/drug-shortage";
import { drugs } from "../lib/drugs";

// Mock AI prediction service - in a real app, this would call an AI API
export async function predictDrugShortage(
  input: DrugShortageInput
): Promise<DrugShortageOutput> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const drugInfo = drugs.find(
    (d) => d.name.toLowerCase() === input.drugName.toLowerCase()
  );

  if (!drugInfo) {
    return {
      found: false,
      drugName: input.drugName,
      genericName: "",
      category: "",
      shortageRisk: {
        level: "UNKNOWN",
        score: 0,
        percentage: "0%",
        icon: "❓",
      },
      warning: "",
      daysUntilShortage: 0,
      estimatedShortageDate: "",
      pricing: {
        currentPrice: "",
        cheapestAlternative: "",
        monthlySavings: "",
      },
      alternatives: [],
      riskFactors: [],
      recommendations: [],
    };
  }

  const riskScore = drugInfo.shortage_risk;
  let riskLevel = "LOW";
  let riskIcon = "🟢";

  if (riskScore >= 0.7) {
    riskLevel = "HIGH";
    riskIcon = "🔴";
  } else if (riskScore >= 0.4) {
    riskLevel = "MEDIUM";
    riskIcon = "🟡";
  }

  const daysUntilShortage = Math.max(1, Math.floor((1 - riskScore) * 180));
  const shortageDate = new Date();
  shortageDate.setDate(shortageDate.getDate() + daysUntilShortage);

  const cheapestAlt = drugInfo.alternatives.reduce((prev, curr) =>
    prev.price < curr.price ? prev : curr
  );

  const monthlySavings = Math.max(
    0,
    (drugInfo.average_price - cheapestAlt.price) * 30
  );

  return {
    found: true,
    drugName: drugInfo.name,
    genericName: drugInfo.generic_name,
    category: drugInfo.category,
    shortageRisk: {
      level: riskLevel,
      score: riskScore,
      percentage: `${Math.round(riskScore * 100)}%`,
      icon: riskIcon,
    },
    warning: `${riskLevel} risk of shortage detected for ${drugInfo.name}`,
    daysUntilShortage,
    estimatedShortageDate: shortageDate.toLocaleDateString(),
    pricing: {
      currentPrice: `₹${drugInfo.average_price}`,
      cheapestAlternative: cheapestAlt.name,
      monthlySavings: `₹${monthlySavings.toFixed(0)}`,
    },
    alternatives: drugInfo.alternatives,
    riskFactors: drugInfo.risk_factors,
    recommendations: generateRecommendations(riskLevel, drugInfo),
  };
}

function generateRecommendations(riskLevel: string, drugInfo: any) {
  const recommendations = [];

  if (riskLevel === "HIGH") {
    recommendations.push({
      priority: "URGENT",
      action: "Stock up immediately",
      details: `Purchase a 2-3 month supply of ${drugInfo.name} from multiple pharmacies to ensure availability.`,
    });
  }

  recommendations.push({
    priority: riskLevel === "HIGH" ? "HIGH" : "MEDIUM",
    action: "Consider alternatives",
    details: `Consult your doctor about switching to ${
      drugInfo.alternatives[0]?.name || "alternative medications"
    }.`,
  });

  recommendations.push({
    priority: "LOW",
    action: "Monitor regularly",
    details:
      "Check back weekly for updated shortage predictions and availability status.",
  });

  return recommendations;
}
