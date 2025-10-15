import React from "react";
import { DrugShortageOutput } from "../types/drug-shortage";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import {
  Clock,
  BarChart2,
  Pill,
  AlertTriangle,
  CheckCircle,
  AlertCircle as AlertCircleIcon,
} from "lucide-react";
import RiskIndicator from "./RiskIndicator";
import AlternativesTable from "./AlternativesTable";
import RecommendationsAccordion from "./RecommendationsAccordion";

interface Props {
  data: DrugShortageOutput;
}

const ShortagePrediction: React.FC<Props> = ({ data }) => {
  if (!data.found) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Drug Not Found</AlertTitle>
        <AlertDescription>
          The drug you searched for could not be found. Please check the
          spelling.
        </AlertDescription>
      </Alert>
    );
  }

  const riskClasses = {
    HIGH: {
      alert: "border-red-500/50 text-red-600 bg-red-500/10",
      title: "text-red-600",
    },
    MEDIUM: {
      alert: "border-orange-500/50 text-orange-600 bg-orange-500/10",
      title: "text-orange-600",
    },
    LOW: {
      alert: "border-green-500/50 text-green-700 bg-green-500/10",
      title: "text-green-700",
    },
  }[data.shortageRisk.level.toUpperCase()] || {
    alert: "border-gray-200",
    title: "text-gray-900",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">{data.drugName}</h2>
        <div className="flex items-center gap-2 text-gray-600">
          <span>{data.genericName}</span>
          <span className="text-sm">•</span>
          <Badge variant="secondary">{data.category}</Badge>
        </div>
      </div>

      <Alert className={riskClasses.alert}>
        <span className="mr-3 text-2xl">{data.shortageRisk.icon}</span>
        <div>
          <AlertTitle className={`font-bold text-lg ${riskClasses.title}`}>
            Warning
          </AlertTitle>
          <AlertDescription className="font-medium">
            {data.warning}
          </AlertDescription>
        </div>
      </Alert>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-medium">Shortage Risk</span>
            <BarChart2 className="h-5 w-5 text-gray-500" />
          </div>
          <RiskIndicator risk={data.shortageRisk} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-medium">Time to Shortage</span>
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-3xl font-bold">
            {data.daysUntilShortage} days
          </div>
          <p className="text-xs text-gray-500">
            Estimated shortage by {data.estimatedShortageDate}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-medium">Pricing & Savings</span>
            <span className="font-bold text-gray-500">₹</span>
          </div>
          <div className="text-3xl font-bold">{data.pricing.currentPrice}</div>
          <p className="text-xs text-gray-500">
            Switch to {data.pricing.cheapestAlternative} to save ~
            <span className="font-semibold text-primary-600">
              {data.pricing.monthlySavings}/month
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="h-5 w-5" />
            <h3 className="text-xl font-bold">Alternative Medications</h3>
          </div>
          <AlternativesTable alternatives={data.alternatives} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-xl font-bold">Risk Factors</h3>
          </div>
          <ul className="space-y-2">
            {data.riskFactors.map((factor, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-400 shrink-0" />
                <span className="text-sm capitalize">
                  {factor.replace(/_/g, " ")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h3 className="text-xl font-bold">Actionable Recommendations</h3>
        </div>
        <RecommendationsAccordion recommendations={data.recommendations} />
      </div>
    </div>
  );
};

export default ShortagePrediction;
