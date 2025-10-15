import {
  Prescription,
  MedicineStock,
  Alert,
  AlertType,
  ChatMessage,
} from "./types";

export const MOCK_INITIAL_DATA = {
  prescriptions: [
    {
      id: "p1",
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "Verified",
      medicines: [
        {
          id: "m1",
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "1 daily",
          duration: "30 days",
        },
        {
          id: "m2",
          name: "Metformin",
          dosage: "500mg",
          frequency: "2 daily",
          duration: "30 days",
        },
      ],
      warnings: [],
    },
  ] as Prescription[],
  medicineStocks: [
    {
      id: "ms1",
      name: "Lisinopril",
      expiryDate: "2025-12-31",
      quantity: 50,
      dailyUsage: 1,
    },
    {
      id: "ms2",
      name: "Metformin",
      expiryDate: "2024-09-30",
      quantity: 8,
      dailyUsage: 2,
    },
    {
      id: "ms3",
      name: "Ibuprofen",
      expiryDate: "2024-08-15",
      quantity: 25,
      dailyUsage: 0,
    },
  ] as MedicineStock[],
  alerts: [
    {
      id: "a1",
      type: AlertType.LowStock,
      message: "Metformin is low on stock with only 8 remaining.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
      relatedId: "ms2",
    },
  ] as Alert[],
  chatHistory: [
    {
      id: "c1",
      role: "model",
      text: "Hello! I am Nalamdhaanaa. How can I help you today? Please describe your symptoms.",
      timestamp: new Date(),
    },
  ] as ChatMessage[],
};
