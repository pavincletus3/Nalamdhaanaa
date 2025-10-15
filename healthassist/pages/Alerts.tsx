import React, { useState, useCallback } from "react";
import { useData } from "../context/DataContext";
import { Alert as AlertType, AlertType as EnumAlertType } from "../types";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Pill,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import MedicationAlertForm from "../components/MedicationAlertForm";
import MedicationAlertList from "../components/MedicationAlertList";
import DrugShortageChecker from "../components/DrugShortageChecker";

const AlertIcon: React.FC<{ type: EnumAlertType; isRead: boolean }> = ({
  type,
  isRead,
}) => {
  const commonClasses = `h-6 w-6 ${isRead ? "text-gray-400" : ""}`;
  switch (type) {
    case EnumAlertType.DrugInteraction:
      return <AlertTriangle className={`${commonClasses} text-red-500`} />;
    case EnumAlertType.ExpiryWarning:
      return <AlertTriangle className={`${commonClasses} text-yellow-500`} />;
    case EnumAlertType.LowStock:
      return <Pill className={`${commonClasses} text-yellow-500`} />;
    case EnumAlertType.DoctorVisit:
      return <MessageCircle className={`${commonClasses} text-blue-500`} />;
    default:
      return <Bell className={commonClasses} />;
  }
};

const Alerts: React.FC = () => {
  const {
    alerts,
    markAlertAsRead,
    medicationAlerts,
    addMedicationAlert,
    deleteMedicationAlert,
  } = useData();
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "system" | "medication" | "shortage"
  >("system");

  const unreadAlerts = alerts.filter((a) => !a.isRead);
  const readAlerts = alerts.filter((a) => a.isRead);

  const handleCreateMedicationAlert = useCallback(
    (alertPayload: any) => {
      addMedicationAlert(alertPayload);
      setShowMedicationForm(false);
    },
    [addMedicationAlert]
  );

  const handleDeleteMedicationAlert = useCallback(
    (alertId: string) => {
      if (
        window.confirm(
          "Are you sure you want to permanently delete this medication alert?"
        )
      ) {
        deleteMedicationAlert(alertId);
      }
    },
    [deleteMedicationAlert]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Alerts & Warnings</h1>
        {activeTab === "medication" && (
          <button
            onClick={() => setShowMedicationForm(!showMedicationForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            {showMedicationForm ? "Cancel" : "Add Medication Alert"}
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-1 rounded-xl shadow-md wide-card mx-auto">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("system")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "system"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Bell className="h-5 w-5 mr-2" />
            System Alerts
          </button>
          <button
            onClick={() => setActiveTab("medication")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "medication"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Pill className="h-5 w-5 mr-2" />
            Medication Reminders
          </button>
          <button
            onClick={() => setActiveTab("shortage")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "shortage"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Search className="h-5 w-5 mr-2" />
            Drug Shortage Alerts
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "shortage" && <DrugShortageChecker />}

      {activeTab === "medication" && (
        <>
          {showMedicationForm ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <MedicationAlertForm
                onCreateAlert={handleCreateMedicationAlert}
              />
              <MedicationAlertList
                alerts={medicationAlerts}
                onDeleteAlert={handleDeleteMedicationAlert}
              />
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-md wide-card mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Medication Reminders ({medicationAlerts.length})
                </h2>
                <button
                  onClick={() => setShowMedicationForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Manage →
                </button>
              </div>
              {medicationAlerts.length > 0 ? (
                <div className="space-y-2">
                  {medicationAlerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {alert.medication}
                        </p>
                        <p className="text-sm text-gray-600">
                          {alert.dosage} • {alert.schedule.times.join(", ")}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        {alert.channels.map((channel) => (
                          <span
                            key={channel}
                            className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {medicationAlerts.length > 3 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      +{medicationAlerts.length - 3} more alerts
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No medication alerts set up yet.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {activeTab === "system" && (
        <>
          <h2 className="text-2xl font-bold text-gray-800">System Alerts</h2>
          <div className="space-y-4">
            {unreadAlerts.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-md wide-card mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  New Alerts
                </h2>
                <div className="space-y-3">
                  {unreadAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-lg flex items-start justify-between bg-blue-50 border border-blue-200"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertIcon type={alert.type} isRead={alert.isRead} />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-800">
                            {alert.type}
                          </p>
                          <p className="text-sm text-blue-700">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Read
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-md wide-card mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-4">History</h2>
              {readAlerts.length > 0 ? (
                <div className="space-y-3">
                  {readAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-lg flex items-start bg-gray-50"
                    >
                      <div className="flex-shrink-0">
                        <AlertIcon type={alert.type} isRead={alert.isRead} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">
                          {alert.type}
                        </p>
                        <p className="text-sm text-gray-500">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {alert.createdAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No read alerts.</p>
              )}
            </div>

            {alerts.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md wide-card mx-auto">
                <Bell className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2">You have no alerts.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Alerts;
