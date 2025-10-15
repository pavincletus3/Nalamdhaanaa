import React from "react";
import { DrugShortageOutput } from "../types/drug-shortage";

interface Props {
  risk: DrugShortageOutput["shortageRisk"];
}

const RiskIndicator: React.FC<Props> = ({ risk }) => {
  const score = risk.score * 100;

  const riskClasses = {
    HIGH: { text: "text-red-600", bg: "bg-red-600" },
    MEDIUM: { text: "text-orange-500", bg: "bg-orange-500" },
    LOW: { text: "text-green-600", bg: "bg-green-600" },
  }[risk.level.toUpperCase()] || { text: "text-gray-500", bg: "bg-gray-400" };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className={`text-3xl font-bold ${riskClasses.text}`}>
          {risk.level}
        </div>
        <div className="text-lg font-semibold text-gray-500">
          {risk.percentage}
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${riskClasses.bg}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default RiskIndicator;
