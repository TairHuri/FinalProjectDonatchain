import React, { createContext, useState, useContext } from "react";
import { loginUser, registerUser } from "../services/api";

interface NgoData {
  name: string;
  id: string;
  email?: string;
  phone?: string;
  password?: string;
  token?: string; // נוסיף טוקן מהשרת
}

interface AuthContextType {
  ngo: NgoData | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  ngo: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ngo, setNgo] = useState<NgoData | null>(null);

  const login = async (data: { email: string; password: string }): Promise<boolean> => {
    try {
      // שולח email+password
      const res = await loginUser(data); 
      if (res?.token) {
        setNgo({ name: res.name, id: res.id, token: res.token });
        localStorage.setItem("token", res.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await registerUser(data);
      return !!res.success;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const logout = () => {
    setNgo(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ ngo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
