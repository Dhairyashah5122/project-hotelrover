import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: "SuperAdmin" | "Admin" | "Manager" | "Housekeeper";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("first login", email, password);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
