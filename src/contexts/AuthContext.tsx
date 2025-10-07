import React, { createContext, useContext, useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user session on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("footprint_user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  // =============================
  // REGISTER
  // =============================
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return false;
      }

      const userData = data.user;
      const token = data.token;

      localStorage.setItem("footprint_user", JSON.stringify(userData));
      localStorage.setItem("footprint_token", token);
      setUser(userData);

      return true;
    } catch (err) {
      console.error("Registration Error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // LOGIN
  // =============================
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return false;
      }

      const userData = data.user;
      const token = data.token;

      localStorage.setItem("footprint_user", JSON.stringify(userData));
      localStorage.setItem("footprint_token", token);
      setUser(userData);

      return true;
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  // LOGOUT
  // =============================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("footprint_user");
    localStorage.removeItem("footprint_token");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
