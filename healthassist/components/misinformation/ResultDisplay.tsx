import React from "react";
import type { FactCheckResponse } from "../../types";
import { Verdict } from "../../types";
import { CheckIcon } from "../icons/CheckIcon";
import { CrossIcon } from "../icons/CrossIcon";
import { WarningIcon } from "../icons/WarningIcon";
import { QuestionIcon } from "../icons/QuestionIcon";

interface ResultDisplayProps {
  result: FactCheckResponse;
}

const VerdictInfo = {
  [Verdict.TRUE]: {
    label: "True",
    Icon: CheckIcon,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-400",
  },
  [Verdict.FALSE]: {
    label: "False",
    Icon: CrossIcon,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-400",
  },
  [Verdict.MISLEADING]: {
    label: "Misleading",
    Icon: WarningIcon,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-400",
  },
  [Verdict.UNVERIFIED]: {
    label: "Unverified",
    Icon: QuestionIcon,
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    borderColor: "border-gray-400",
  },
};

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.min(Math.max(score, 0), 100);
  let barColor = "bg-gray-400";
  if (percentage > 85) barColor = "bg-green-500";
  else if (percentage > 70) barColor = "bg-primary-500";
  else if (percentage < 30) barColor = "bg-red-500";
  else if (percentage < 50) barColor = "bg-yellow-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`${barColor} h-2.5 rounded-full`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { verdict } = result;
  const { label, Icon, bgColor, textColor, borderColor } = VerdictInfo[verdict];

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border ${borderColor} p-6 sm:p-8 animate-fade-in`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4">
        <h3 className="text-2xl font-bold text-gray-900">Analysis Result</h3>
        <div
          className={`mt-2 sm:mt-0 inline-flex items-center px-4 py-1.5 rounded-full text-lg font-bold ${bgColor} ${textColor}`}
        >
          <Icon className="h-6 w-6 mr-2" />
          {label}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Your Claim
          </h4>
          <p className="text-lg text-gray-700 italic">"{result.user_claim}"</p>
        </div>

        {result.matched_claim && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Closest Match Found
            </h4>
            <p className="text-lg text-gray-900 font-medium">
              "{result.matched_claim}"
            </p>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-primary-700">
                  Similarity Score
                </span>
                <span className="text-sm font-medium text-primary-700">
                  {result.similarity_score.toFixed(1)}%
                </span>
              </div>
              <ScoreBar score={result.similarity_score} />
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Recommendation
          </h4>
          <p className="text-gray-700">{result.recommendation}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left pt-4 border-t">
          <div>
            <p className="text-sm font-semibold text-gray-500">Source</p>
            {result.source_url ? (
              <a
                href={result.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline font-medium"
              >
                {result.source}
              </a>
            ) : (
              <p className="text-gray-800 font-medium">{result.source}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Category</p>
            <p className="text-gray-800 font-medium">{result.category}</p>
          </div>
          {result.date_fact_checked && (
            <div>
              <p className="text-sm font-semibold text-gray-500">
                Date Checked
              </p>
              <p className="text-gray-800 font-medium">
                {result.date_fact_checked}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
