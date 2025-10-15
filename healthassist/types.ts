export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  uploadedAt: Date;
  imageUrl?: string;
  ocrText?: string;
  medicines: Medicine[];
  warnings: string[];
  status: "Verified" | "Pending Review" | "Error";
}

export interface MedicineStock {
  id: string;
  name: string;
  expiryDate: string;
  quantity: number;
  dailyUsage: number;
}

export enum AlertType {
  DrugInteraction = "Drug Interaction",
  LowStock = "Low Stock",
  ExpiryWarning = "Expiry Warning",
  DoctorVisit = "Doctor Visit",
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  createdAt: Date;
  isRead: boolean;
  relatedId?: string; // e.g., prescription id or medicine id
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface HealthFacility {
  id: string;
  name: string;
  address: string;
  type: "Hospital" | "Clinic" | "Pharmacy";
  distance: string;
  isOpen: boolean;
}

// Medication Alert Types (from alert module)
export type Channel = "email" | "telegram";

export interface Schedule {
  start_date: string;
  end_date: string;
  times: string[];
  frequency: "daily";
}

export interface QuietHours {
  start: number;
  end: number;
}

export interface MedicationAlertPayload {
  user_id: number;
  prescription_id: number;
  medication: string;
  dosage: string;
  schedule: Schedule;
  channels: Channel[];
  quiet_hours: QuietHours;
  notes?: string;
}

export interface MedicationAlert extends MedicationAlertPayload {
  id: string;
}

// Misinformation Detection Types
export enum Verdict {
  TRUE = "TRUE",
  FALSE = "FALSE",
  MISLEADING = "MISLEADING",
  UNVERIFIED = "UNVERIFIED",
}

export interface FactCheckResponse {
  user_claim: string;
  matched_claim: string | null;
  similarity_score: number;
  verdict: Verdict;
  verdict_icon: string;
  source: string;
  source_url: string | null;
  category: string;
  evidence_score: number;
  recommendation: string;
  date_fact_checked: string | null;
}
