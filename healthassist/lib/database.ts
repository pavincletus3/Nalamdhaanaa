import { supabase } from "./supabase";

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("_health_check")
      .select("*")
      .limit(1);

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
};

// Example user profile functions (you can expand these)
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
};

// Example health records functions
export const getHealthRecords = async (userId: string) => {
  const { data, error } = await supabase
    .from("health_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

export const createHealthRecord = async (record: any) => {
  const { data, error } = await supabase
    .from("health_records")
    .insert([record])
    .select()
    .single();

  return { data, error };
};
