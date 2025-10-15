import React from "react";
import { Menu, LogOut, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/landing");
  };

  const handleGoHome = () => {
    navigate("/landing");
  };

  return (
    <header className="relative bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-10 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-200"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-3">
            <button
              onClick={handleGoHome}
              className="btn-secondary flex items-center text-sm"
              title="Go to Homepage"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
