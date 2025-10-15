import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart2,
  UploadCloud,
  MessageSquare,
  Pill,
  MapPin,
  Bell,
  Settings,
  Shield,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart2 },
  { name: "Prescriptions", href: "/prescriptions", icon: UploadCloud },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "My Medicines", href: "/medicines", icon: Pill },
  { name: "Nearby Health", href: "/nearby", icon: MapPin },
  { name: "Fact Check", href: "/misinformation", icon: Shield },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navLinkClasses = (href: string) =>
    location.pathname === href ? "nav-link-active" : "nav-link-inactive";

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-slate-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-xl border-r border-gray-200/50">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto custom-scrollbar">
            <div className="flex-shrink-0 flex items-center px-6 mb-8">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">
                Nalamdhaanaa
              </span>
            </div>
            <nav className="px-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={navLinkClasses(item.href)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0 sidebar-container">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 bg-white/95 backdrop-blur-xl border-r border-gray-200/50">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto custom-scrollbar">
              <div className="flex items-center flex-shrink-0 px-6 mb-8">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg animate-glow">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">
                  Nalamdhaanaa
                </span>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={navLinkClasses(item.href)}
                  >
                    <item.icon
                      className="mr-4 flex-shrink-0 h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
