import React, { useState } from "react";
import { useData } from "../context/DataContext";

const Settings: React.FC = () => {
  const { settings, updateSettings } = useData();
  const [expiryThreshold, setExpiryThreshold] = useState(
    settings.expiryThreshold
  );
  const [stockThreshold, setStockThreshold] = useState(settings.stockThreshold);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ expiryThreshold, stockThreshold });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="expiryThreshold"
              className="block text-sm font-medium text-gray-700"
            >
              Medicine Expiry Warning
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Get an alert when a medicine is expiring within this many days.
            </p>
            <select
              id="expiryThreshold"
              value={expiryThreshold}
              onChange={(e) => setExpiryThreshold(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="stockThreshold"
              className="block text-sm font-medium text-gray-700"
            >
              Low Stock Warning
            </label>
            <p className="text-xs text-gray-500 mb-1">
              Get an alert when medicine quantity falls to this level.
            </p>
            <input
              type="number"
              id="stockThreshold"
              value={stockThreshold}
              onChange={(e) => setStockThreshold(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end items-center">
          {saved && (
            <span className="text-green-600 text-sm mr-4">Settings saved!</span>
          )}
          <button
            onClick={handleSave}
            className="bg-primary-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Account</h2>
        <div className="space-y-2">
          <button className="text-sm font-medium text-primary hover:underline">
            Edit Profile
          </button>
          <button className="text-sm font-medium text-primary hover:underline">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
