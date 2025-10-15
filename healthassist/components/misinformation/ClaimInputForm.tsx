import React, { useState } from "react";

interface ClaimInputFormProps {
  onSubmit: (claim: string) => void;
  isLoading: boolean;
}

export const ClaimInputForm: React.FC<ClaimInputFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [claim, setClaim] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(claim);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="claim"
          className="block text-lg font-semibold text-gray-700 mb-2"
        >
          Enter a Medical Claim to Verify
        </label>
        <textarea
          id="claim"
          name="claim"
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow duration-200 text-base"
          placeholder="e.g., '5G towers spread coronavirus' or 'Washing hands prevents infections'"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !claim.trim()}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Analyzing...
          </>
        ) : (
          "Check Claim"
        )}
      </button>
    </form>
  );
};
