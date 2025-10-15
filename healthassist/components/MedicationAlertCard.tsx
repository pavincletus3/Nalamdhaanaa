import React from "react";
import type { MedicationAlert } from "../types";
import TrashIcon from "./icons/TrashIcon";
import DocumentTextIcon from "./icons/DocumentTextIcon";

interface MedicationAlertCardProps {
  alert: MedicationAlert;
  onDeleteAlert: (id: string) => void;
}

const MedicationAlertCard: React.FC<MedicationAlertCardProps> = ({
  alert,
  onDeleteAlert,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {alert.medication}
          </h3>
          <p className="text-sm text-gray-600">{alert.dosage}</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5">
            {alert.channels.map((channel) => (
              <span
                key={channel}
                className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                  channel === "email"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-teal-100 text-teal-800"
                }`}
                title={`${
                  channel.charAt(0).toUpperCase() + channel.slice(1)
                } enabled`}
              >
                {channel}
              </span>
            ))}
          </div>
          <button
            onClick={() => onDeleteAlert(alert.id)}
            className="p-1 text-gray-400 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label={`Delete alert for ${alert.medication}`}
            title="Delete Alert"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Schedule Period</span>
          <span className="font-medium text-gray-700">
            {formatDate(alert.schedule.start_date)} -{" "}
            {formatDate(alert.schedule.end_date)}
          </span>
        </div>

        <div className="mt-2">
          <span className="text-sm text-gray-500">Daily Times</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {alert.schedule.times.map((time, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full"
              >
                {time}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
          <span>Quiet Hours</span>
          <span className="font-medium text-gray-700">
            {`${alert.quiet_hours.start}:00 - ${alert.quiet_hours.end}:00`}
          </span>
        </div>

        {alert.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm font-medium text-gray-800">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>Notes</span>
            </div>
            <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
              {alert.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationAlertCard;
