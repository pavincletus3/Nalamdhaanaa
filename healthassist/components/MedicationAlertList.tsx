import React from "react";
import type { MedicationAlert } from "../types";
import MedicationAlertCard from "./MedicationAlertCard";

interface MedicationAlertListProps {
  alerts: MedicationAlert[];
  onDeleteAlert: (id: string) => void;
}

const MedicationAlertList: React.FC<MedicationAlertListProps> = ({
  alerts,
  onDeleteAlert,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Scheduled Medication Alerts ({alerts.length})
      </h2>
      {alerts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No medication alerts scheduled yet.</p>
          <p className="text-sm text-gray-400">
            Use the form to create your first alert.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {alerts.map((alert) => (
            <MedicationAlertCard
              key={alert.id}
              alert={alert}
              onDeleteAlert={onDeleteAlert}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationAlertList;
