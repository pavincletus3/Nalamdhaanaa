import React from "react";

interface MedicationInfoProps {
  info: string | null;
  isLoading: boolean;
  error: string | null;
  medicationName: string;
}

const MedicationInfo: React.FC<MedicationInfoProps> = ({
  info,
  isLoading,
  error,
  medicationName,
}) => {
  if (!isLoading && !error && !info) {
    return null;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-600">{error}</p>;
    }
    if (info) {
      const parts = info.split(/\*\*(.*?)\*\*/g).filter((part) => part);
      return (
        <div>
          {parts.map((part, index) => {
            if (index % 2 === 0) {
              return (
                <p key={index} className="inline">
                  {part}
                </p>
              );
            } else {
              return (
                <strong
                  key={index}
                  className="text-blue-800 font-semibold block mt-2 mb-1"
                >
                  {part}
                </strong>
              );
            }
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-4 p-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
      <h4 className="text-lg font-bold text-gray-800 mb-2">
        AI Suggestion for:{" "}
        <span className="text-blue-600">{medicationName}</span>
      </h4>
      <div className="text-sm text-gray-700">{renderContent()}</div>
    </div>
  );
};

export default MedicationInfo;
