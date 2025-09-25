import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser, getNgoProfile } from "../services/api";

interface NgoData {
  name: string;
  _id: string;
  ngoId?: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  bankAccount?: string;
  wallet?: string;
  goals?: string;
  token: string;
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

useEffect(() => {
  const savedNgo = localStorage.getItem("ngoData");
  if (savedNgo) {
    setNgo(JSON.parse(savedNgo));
  }
}, []);


  const fetchNgoData = async (token: string) => {
  try {
    const res = await getNgoProfile(token); // קריאת פרופיל מהשרת
    if (res) {
      const ngoData: NgoData = {
        name: res.name ?? "",
        _id: res.id ?? "",
        ngoId: res.ngoId ?? "",
        email: res.email ?? "",
        phone: res.phone ?? "",
        address: res.address ?? "",
        bankAccount: res.bankAccount ?? "",
        wallet: res.wallet ?? "",
        goals: res.goals ?? "",
        token, // חייב להיות כי שמרנו בלוקאל סטורג'
      };
      setNgo(ngoData);
      localStorage.setItem("ngoData", JSON.stringify(ngoData));
    }
  } catch (err) {
    console.error("Failed to fetch NGO profile", err);
  }
};

const login = async (data: { email: string; password: string }): Promise<boolean> => {
  try {
    const res = await loginUser(data);

    if (res?.token && res?.user) {
      // נשמור את הנתונים שהגיעו מהשרת
      const ngoData: NgoData = {
        _id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        ngoId: res.user.ngoId,
        phone: res.user.phone,
        address: res.user.address,
        bankAccount: res.user.bankAccount,
        wallet: res.user.wallet,
        goals: res.user.goals,
        token: res.token,
      };

      setNgo(ngoData);
      localStorage.setItem("token", res.token);
      localStorage.setItem("ngoData", JSON.stringify(ngoData));

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
    localStorage.removeItem("ngoData");
  };

  return (
    <AuthContext.Provider value={{ ngo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
