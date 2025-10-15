import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { drugs } from "../lib/drugs";
import { predictDrugShortage } from "../services/drug-shortage";
import { DrugShortageOutput } from "../types/drug-shortage";
import ShortagePrediction from "./ShortagePrediction";

const DrugShortageChecker: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<DrugShortageOutput | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 1) {
      const filteredSuggestions = drugs
        .filter((drug) => drug.name.toLowerCase().includes(value.toLowerCase()))
        .map((drug) => drug.name);
      setSuggestions(filteredSuggestions);
      setIsSuggestionBoxOpen(true);
    } else {
      setSuggestions([]);
      setIsSuggestionBoxOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsSuggestionBoxOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const drugInfo = drugs.find(
        (d) => d.name.toLowerCase() === inputValue.toLowerCase()
      );

      if (!drugInfo) {
        setError(
          `Drug "${inputValue}" not found in our database. Please check the spelling or try a different drug.`
        );
        setResult(null);
        return;
      }

      const input = {
        drugName: drugInfo.name,
        riskFactors: drugInfo.risk_factors,
        alternatives: drugInfo.alternatives.map((alt) => ({
          name: alt.name,
          price: alt.price,
          availability: alt.availability,
        })),
      };

      const prediction = await predictDrugShortage(input);
      setResult(prediction);
      setInputValue("");
    } catch (err) {
      setError("Failed to get prediction. Please try again later.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Drug Shortage Predictor
        </h2>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="e.g., Amoxicillin 500mg"
                className="flex-grow text-base"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={() =>
                  setTimeout(() => setIsSuggestionBoxOpen(false), 150)
                }
                onFocus={handleInputChange}
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full shrink-0 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Check Shortage
                  </>
                )}
              </Button>
            </div>
            {isSuggestionBoxOpen && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border bg-white p-1 shadow-lg sm:w-[calc(100%-11rem-0.5rem)]">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="cursor-pointer rounded p-2 text-sm hover:bg-gray-50"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>

      <div>
        {result ? (
          <ShortagePrediction data={result} />
        ) : (
          <div className="text-center text-gray-500 bg-white p-8 rounded-xl shadow-md">
            <p>Enter a drug name to begin the analysis.</p>
            <p className="text-sm mt-1">
              Examples: "Amoxicillin 500mg", "Metformin 500mg", or "Paracetamol
              500mg".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugShortageChecker;
