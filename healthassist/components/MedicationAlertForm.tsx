import React, { useState, useCallback } from "react";
import type { MedicationAlertPayload, Channel } from "../types";
import PlusIcon from "./icons/PlusIcon";
import TrashIcon from "./icons/TrashIcon";
import MedicationInfo from "./MedicationInfo";
import { getMedicationInfo } from "../services/geminiService";

type FormPayload = Omit<MedicationAlertPayload, "user_id">;

interface MedicationAlertFormProps {
  onCreateAlert: (alert: FormPayload) => void;
}

const getTodayString = () => new Date().toISOString().split("T")[0];

const MedicationAlertForm: React.FC<MedicationAlertFormProps> = ({
  onCreateAlert,
}) => {
  const [formData, setFormData] = useState<FormPayload>({
    prescription_id: 42,
    medication: "Ibuprofen 400mg",
    dosage: "1 tablet",
    notes: "",
    schedule: {
      start_date: getTodayString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      times: ["08:00", "20:00"],
      frequency: "daily",
    },
    channels: ["email"],
    quiet_hours: { start: 22, end: 7 },
  });

  const [medicationInfo, setMedicationInfo] = useState<string | null>(null);
  const [isInfoLoading, setIsInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    parentKey: "schedule" | "quiet_hours"
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [name]: parentKey === "quiet_hours" ? parseInt(value, 10) : value,
      },
    }));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.schedule.times];
    newTimes[index] = value;
    setFormData((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, times: newTimes },
    }));
  };

  const addTime = () => {
    if (formData.schedule.times.length < 5) {
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          times: [...prev.schedule.times, "12:00"],
        },
      }));
    }
  };

  const removeTime = (index: number) => {
    const newTimes = formData.schedule.times.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, times: newTimes },
    }));
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const channel = value as Channel;
    setFormData((prev) => {
      const newChannels = checked
        ? [...prev.channels, channel]
        : prev.channels.filter((c) => c !== channel);
      return { ...prev, channels: newChannels };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateAlert(formData);
  };

  const handleGetInfo = useCallback(async () => {
    setInfoError(null);
    setIsInfoLoading(true);
    setMedicationInfo(null);
    try {
      const info = await getMedicationInfo(formData.medication);
      setMedicationInfo(info);
    } catch (err: any) {
      setInfoError(err.message || "An unknown error occurred.");
    } finally {
      setIsInfoLoading(false);
    }
  }, [formData.medication]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Create Medication Alert
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Medication Details */}
        <div>
          <label
            htmlFor="medication"
            className="block text-sm font-medium text-gray-700"
          >
            Medication
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="medication"
              id="medication"
              value={formData.medication}
              onChange={handleChange}
              className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Paracetamol 500mg"
              required
            />
            <button
              type="button"
              onClick={handleGetInfo}
              disabled={isInfoLoading || !formData.medication}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInfoLoading ? "Loading..." : "Get Info"}
            </button>
          </div>
          <MedicationInfo
            info={medicationInfo}
            isLoading={isInfoLoading}
            error={infoError}
            medicationName={formData.medication}
          />
        </div>{" "}
        <div>
          <label
            htmlFor="dosage"
            className="block text-sm font-medium text-gray-700"
          >
            Dosage
          </label>
          <input
            type="text"
            name="dosage"
            id="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Take with food"
          />
        </div>
        {/* Schedule */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                value={formData.schedule.start_date}
                onChange={(e) => handleNestedChange(e, "schedule")}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                value={formData.schedule.end_date}
                onChange={(e) => handleNestedChange(e, "schedule")}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Times (Daily)
            </label>
            {formData.schedule.times.map((time, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeTime(index)}
                  className="ml-2 p-1 text-gray-500 hover:text-red-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTime}
              className="mt-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-5 w-5 mr-1" /> Add Time
            </button>
          </div>
        </div>
        {/* Channels & Quiet Hours */}
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Channels</h3>
            <div className="mt-2 space-y-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email"
                    name="channels"
                    value="email"
                    type="checkbox"
                    checked={formData.channels.includes("email")}
                    onChange={handleChannelChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700">
                    Email
                  </label>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="telegram"
                    name="channels"
                    value="telegram"
                    type="checkbox"
                    checked={formData.channels.includes("telegram")}
                    onChange={handleChannelChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="telegram"
                    className="font-medium text-gray-700"
                  >
                    Telegram
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quiet Hours</h3>
            <div className="flex items-center mt-2 space-x-2">
              <input
                type="number"
                name="start"
                id="quiet_start"
                value={formData.quiet_hours.start}
                onChange={(e) => handleNestedChange(e, "quiet_hours")}
                min="0"
                max="23"
                className="w-1/2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                name="end"
                id="quiet_end"
                value={formData.quiet_hours.end}
                onChange={(e) => handleNestedChange(e, "quiet_hours")}
                min="0"
                max="23"
                className="w-1/2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="pt-5">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Create Alert
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationAlertForm;
