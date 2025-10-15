import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ email: string } | null>(null);

  const login = (email: string) => {
    // In a real app, this would involve a call to Firebase Auth
    setUser({ email });
  };

  const logout = () => {
    setUser(null);
    // Redirect to landing page after logout
    window.location.href = "#/landing";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
