import React from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  MessageSquare,
  Pill,
  FileText,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { Alert as AlertType } from "../types";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { prescriptions, medicineStocks, alerts } = useData();

  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  const upcomingExpiries = medicineStocks.filter((med) => {
    const expiryDate = new Date(med.expiryDate);
    const today = new Date();
    const daysUntilExpiry =
      (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 14;
  }).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {getGreeting()},{" "}
          <span className="text-gradient">{user?.email.split("@")[0]}</span>!
        </h1>
        <p className="text-lg text-gray-600">
          Here's your personalized health overview for today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="card-grid card-grid-4">
        <Card
          title="Active Prescriptions"
          value={prescriptions.length}
          icon={<FileText className="h-6 w-6" />}
          color="teal"
          trend={{ value: 12, isPositive: true }}
        />
        <Card
          title="Medicines Tracked"
          value={medicineStocks.length}
          icon={<Pill className="h-6 w-6" />}
          color="emerald"
          trend={{ value: 8, isPositive: true }}
        />
        <Card
          title="Upcoming Expiries"
          value={upcomingExpiries}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="cyan"
          trend={{ value: 3, isPositive: false }}
        />
        <Card
          title="Unread Alerts"
          value={unreadAlerts}
          icon={<Bell className="h-6 w-6" />}
          color="slate"
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-8 wide-card mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="card-grid card-grid-3">
          <Link
            to="/prescriptions"
            className="group flex flex-col items-center text-center p-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl hover:from-teal-100 hover:to-teal-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-teal-200"
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300 mb-4">
              <UploadCloud className="h-8 w-8 text-teal-600" />
            </div>
            <span className="font-semibold text-teal-700 text-lg">
              Upload Prescription
            </span>
            <span className="text-sm text-teal-600 mt-2">
              Add new prescriptions to your health record
            </span>
          </Link>
          <Link
            to="/chat"
            className="group flex flex-col items-center text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-emerald-200"
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300 mb-4">
              <MessageSquare className="h-8 w-8 text-emerald-600" />
            </div>
            <span className="font-semibold text-emerald-700 text-lg">
              AI Health Assistant
            </span>
            <span className="text-sm text-emerald-600 mt-2">
              Get instant health advice and symptom analysis
            </span>
          </Link>
          <Link
            to="/medicines"
            className="group flex flex-col items-center text-center p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-cyan-200"
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300 mb-4">
              <Pill className="h-8 w-8 text-cyan-600" />
            </div>
            <span className="font-semibold text-cyan-700 text-lg">
              Medicine Tracker
            </span>
            <span className="text-sm text-cyan-600 mt-2">
              Monitor your medications and set reminders
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card p-8 wide-card mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Alerts</h2>
          <Link to="/alerts" className="btn-secondary text-sm py-2 px-4">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {alerts.slice(0, 3).map((alert: AlertType) => (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl flex items-start transition-all duration-200 ${
                alert.isRead
                  ? "bg-gray-50 border border-gray-200"
                  : "bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 shadow-sm"
              }`}
            >
              <div className="flex-shrink-0">
                <div
                  className={`p-2 rounded-xl ${
                    alert.isRead ? "bg-gray-200" : "bg-red-100"
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.isRead ? "text-gray-500" : "text-red-600"
                    }`}
                  />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p
                  className={`font-semibold ${
                    alert.isRead ? "text-gray-700" : "text-red-800"
                  }`}
                >
                  {alert.type}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    alert.isRead ? "text-gray-600" : "text-red-700"
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 bg-green-100 rounded-2xl inline-block mb-4">
                <Bell className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600 font-medium">All caught up!</p>
              <p className="text-sm text-gray-500 mt-1">
                No new alerts at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
