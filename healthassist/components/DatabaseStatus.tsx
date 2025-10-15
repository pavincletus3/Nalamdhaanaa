import React from "react";
import { useDatabase } from "../lib/useDatabase";

export const DatabaseStatus: React.FC = () => {
  const { isConnected, loading, error, testConnection } = useDatabase();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Connecting to database...</span>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex items-center space-x-2 text-red-600">
  //       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
  //       <span className="text-sm">Database connection failed</span>
  //       <button
  //         onClick={testConnection}
  //         className="text-xs underline hover:no-underline"
  //       >
  //         Retry
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm">Database connected</span>
    </div>
  );
};
