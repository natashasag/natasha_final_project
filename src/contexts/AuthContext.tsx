import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('footprint_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('footprint_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem('footprint_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const user = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(user);
      localStorage.setItem('footprint_user', JSON.stringify(user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem('footprint_users') || '[]');
    
    // Check if user already exists
    if (storedUsers.find((u: any) => u.email === email)) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('footprint_users', JSON.stringify(storedUsers));
    
    // Log in the new user
    const user = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(user);
    localStorage.setItem('footprint_user', JSON.stringify(user));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('footprint_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};