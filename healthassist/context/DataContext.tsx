import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  Prescription,
  MedicineStock,
  Alert,
  ChatMessage,
  AlertType,
  MedicationAlert,
  MedicationAlertPayload,
} from "../types";
import { MOCK_INITIAL_DATA } from "../constants";

interface DataContextType {
  prescriptions: Prescription[];
  addPrescription: (prescription: Prescription) => void;
  medicineStocks: MedicineStock[];
  addMedicineStock: (medicine: MedicineStock) => void;
  updateMedicineStock: (updatedMedicine: MedicineStock) => void;
  deleteMedicineStock: (id: string) => void;
  alerts: Alert[];
  addAlerts: (newAlerts: Alert[]) => void;
  markAlertAsRead: (id: string) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  medicationAlerts: MedicationAlert[];
  addMedicationAlert: (alert: Omit<MedicationAlertPayload, "user_id">) => void;
  deleteMedicationAlert: (id: string) => void;
  settings: { expiryThreshold: number; stockThreshold: number };
  updateSettings: (newSettings: {
    expiryThreshold?: number;
    stockThreshold?: number;
  }) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    MOCK_INITIAL_DATA.prescriptions
  );
  const [medicineStocks, setMedicineStocks] = useState<MedicineStock[]>(
    MOCK_INITIAL_DATA.medicineStocks
  );
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_INITIAL_DATA.alerts);
  const [medicationAlerts, setMedicationAlerts] = useState<MedicationAlert[]>(
    []
  );
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    MOCK_INITIAL_DATA.chatHistory
  );
  const [settings, setSettings] = useState({
    expiryThreshold: 14,
    stockThreshold: 10,
  });

  const addPrescription = (prescription: Prescription) => {
    setPrescriptions((prev) => [prescription, ...prev]);
  };

  const addMedicineStock = (medicine: MedicineStock) => {
    setMedicineStocks((prev) => [...prev, medicine]);
  };

  const updateMedicineStock = (updatedMedicine: MedicineStock) => {
    setMedicineStocks((prev) =>
      prev.map((m) => (m.id === updatedMedicine.id ? updatedMedicine : m))
    );
  };

  const deleteMedicineStock = (id: string) => {
    setMedicineStocks((prev) => prev.filter((m) => m.id !== id));
  };

  const addAlerts = (newAlerts: Alert[]) => {
    setAlerts((prev) => [...newAlerts, ...prev]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const addMedicationAlert = (
    alertPayload: Omit<MedicationAlertPayload, "user_id">
  ) => {
    const newAlert: MedicationAlert = {
      ...alertPayload,
      user_id: 1, // Default user ID
      id: new Date().toISOString() + Math.random(), // Simple unique ID
    };
    setMedicationAlerts((prev) => [newAlert, ...prev]);
  };

  const deleteMedicationAlert = (id: string) => {
    setMedicationAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const updateSettings = (newSettings: {
    expiryThreshold?: number;
    stockThreshold?: number;
  }) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Effect to check for low stock and expiry warnings
  useEffect(() => {
    const checkMedicines = () => {
      const newAlerts: Alert[] = [];
      const today = new Date();

      medicineStocks.forEach((med) => {
        // Check expiry date
        const expiryDate = new Date(med.expiryDate);
        const daysUntilExpiry =
          (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        if (
          daysUntilExpiry > 0 &&
          daysUntilExpiry <= settings.expiryThreshold
        ) {
          const existingAlert = alerts.find(
            (a) => a.relatedId === med.id && a.type === AlertType.ExpiryWarning
          );
          if (!existingAlert) {
            newAlerts.push({
              id: `alert-exp-${med.id}`,
              type: AlertType.ExpiryWarning,
              message: `${med.name} is expiring in ${Math.ceil(
                daysUntilExpiry
              )} days.`,
              createdAt: new Date(),
              isRead: false,
              relatedId: med.id,
            });
          }
        }

        // Check low stock
        if (med.quantity <= settings.stockThreshold) {
          const existingAlert = alerts.find(
            (a) => a.relatedId === med.id && a.type === AlertType.LowStock
          );
          if (!existingAlert) {
            newAlerts.push({
              id: `alert-low-${med.id}`,
              type: AlertType.LowStock,
              message: `${med.name} is low on stock with only ${med.quantity} remaining.`,
              createdAt: new Date(),
              isRead: false,
              relatedId: med.id,
            });
          }
        }
      });

      if (newAlerts.length > 0) {
        addAlerts(newAlerts);
      }
    };

    // This simulates a daily check
    checkMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineStocks, settings]);

  return (
    <DataContext.Provider
      value={{
        prescriptions,
        addPrescription,
        medicineStocks,
        addMedicineStock,
        updateMedicineStock,
        deleteMedicineStock,
        alerts,
        addAlerts,
        markAlertAsRead,
        medicationAlerts,
        addMedicationAlert,
        deleteMedicationAlert,
        chatHistory,
        addChatMessage,
        settings,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
