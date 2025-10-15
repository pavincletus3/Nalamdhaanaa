import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export function useDatabase() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("_health_check")
        .select("*")
        .limit(1);

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "table not found" which is fine
        throw error;
      }

      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("Database connection error:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isConnected,
    loading,
    error,
    testConnection,
    supabase,
  };
}
