import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, } from "../services/userApi";
import { registerUserExistingNgo, getNgoById } from "../services/ngoApi";

import type { User } from "../models/User";
import type { Ngo } from "../models/Ngo";


// Defines the shape of the authentication context
// This interface ensures strong typing when using the AuthContext
interface AuthContextType {
  user: User | null;
  ngo: Ngo | null;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean, message: string }>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateNgo: (ngo: Ngo) => void
  updateUser: (user: User) => void
}

// Create context with default stub values to avoid undefined usage
const AuthContext = createContext<AuthContextType>({
  user: null,
  ngo: null,
  login: async () => ({ success: true, message: '' }),
  register: async () => false,
  logout: () => { },
  updateNgo: (ngo: Ngo) => { },
  updateUser: (user: User) => {},
});

// Main authentication provider component
// Wraps the entire app and exposes authentication state and methods
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Holds currently logged-in user
  const [user, setUser] = useState<User | null>(null);

  // Holds associated NGO data for the user
  const [ngo, setNgo] = useState<Ngo | null>(null);

  // Updates NGO both in React state and localStorage for persistence
    const updateNgo = (ngo: Ngo) => {
    localStorage.setItem('ngo', JSON.stringify(ngo))
    setNgo(ngo)
  }
    // Updates user while preserving the authentication token
  const updateUser = (updatedUser: User) => {
    const token = user?.token ||updatedUser.token
    if(!token)return;
    console.log(user, token)
    localStorage.setItem("userData", JSON.stringify({...updatedUser, 'token': token }));
     // localStorage.setItem("userData", JSON.stringify({ ...res.user, 'token': res.token }));
    setUser({...updatedUser, token})
  }

  
  // Load user and NGO from localStorage on initial app load
  // Ensures persistent login after page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const ngo = localStorage.getItem("ngo");
    if (ngo) {
      setNgo(JSON.parse(ngo));
    }
  }, []);

// Handles login logic
  // Sends credentials to the server, stores token, loads NGO info if relevant
const login = async (data: { email: string; password: string }): Promise<{ success: boolean, message: string }> => {
  try {
    const res: { user: User, token: string, success: true } | { success: false, message: string } = await loginUser(data);

    if (res.success) {
      updateUser({ ...res.user, 'token': res.token });
      localStorage.setItem("token", res.token);

      if (res.user?.ngoId) {
        const ngo: Ngo = await getNgoById(res.user.ngoId);
        if (ngo) updateNgo(ngo);
      }

      return { success: true, message: '' };
    } else {
      return { success: false, message: res.message };
    }
  } catch (err) {
    console.error("Login failed", err);
    return { success: false, message: "פרטי ההתחברות שגויים" };
  }
};


// Register a new user under an existing NGO
  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await registerUserExistingNgo(data);
      return !!res.success;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  // Clears user state and authentication storage on logout
  const logout = () => {

    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };
  console.log(user);

   // Provide authentication state and actions to the rest of the app
  return (
    <AuthContext.Provider value={{ ngo, user, login, register, logout, updateUser, updateNgo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);