import React, { useState, useCallback } from "react";
import { ClaimInputForm } from "../components/misinformation/ClaimInputForm";
import { ResultDisplay } from "../components/misinformation/ResultDisplay";
import type { FactCheckResponse } from "../types";
import { checkMedicalClaim } from "../services/misinformationApi";
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";

const Misinformation: React.FC = () => {
  const [claim, setClaim] = useState<string>("");
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckClaim = useCallback(async (claimText: string) => {
    if (!claimText.trim()) {
      setError("Please enter a claim to check.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);
    setClaim(claimText);

    try {
      const response = await checkMedicalClaim(claimText);
      setResult(response);
    } catch (err) {
      setError("An error occurred while checking the claim. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Misinformation Detector
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered tool cross-references your query with a database of
            fact-checked medical claims from trusted sources like the WHO and
            CDC.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Verified Sources</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Cross-referenced with WHO, CDC, and other trusted health
              authorities
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-gray-900">
                Real-time Analysis
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Instant fact-checking with similarity scoring and evidence
              assessment
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm">
            <div className="flex items-center mb-3">
              <Info className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Clear Verdicts</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Easy-to-understand results with actionable recommendations
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/50 mb-8">
            <ClaimInputForm onSubmit={handleCheckClaim} isLoading={isLoading} />
          </div>

          {error && (
            <div className="mb-6 text-center text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 mb-8">
              <svg
                className="animate-spin h-10 w-10 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-lg text-gray-600 font-medium">
                Analyzing your claim...
              </p>
              <p className="text-sm text-gray-500">
                Cross-referencing with trusted sources.
              </p>
            </div>
          )}

          {result && (
            <div className="mb-8">
              <ResultDisplay result={result} />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <div className="bg-primary-50/50 backdrop-blur-sm rounded-xl p-6 border border-primary-200/50">
            <h3 className="font-semibold text-primary-900 mb-2">
              Important Disclaimer
            </h3>
            <p className="text-primary-700 text-sm">
              This tool is for informational purposes only and should not
              replace professional medical advice. Always consult with qualified
              healthcare professionals for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Misinformation;
