import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, getNgoProfile, registerUserExistingNgo } from "../services/api";

import type { User } from "../models/User";
import type { Ngo } from "../models/Ngo";


interface AuthContextType {
  user: User | null;
  ngo: Ngo | null;
  login: (data: { email: string; password: string }) => Promise<{ success: boolean, message: string }>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateNgo: (ngo: Ngo) => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  ngo: null,
  login: async () => ({ success: true, message: '' }),
  register: async () => false,
  logout: () => { },
  updateNgo: (ngo: Ngo) => { },
  updateUser: (user: User) => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ngo, setNgo] = useState<Ngo | null>(null);

  const updateNgo = (ngo: Ngo) => {
    localStorage.setItem('ngo', JSON.stringify(ngo))
    setNgo(ngo)
  }
  const updateUser = (updatedUser: User) => {
    const token = user?.token ||updatedUser.token
    if(!token)return;
    localStorage.setItem("userData", JSON.stringify({updatedUser, 'token': token }));
    setUser(updatedUser)
  }

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


  const login = async (data: { email: string; password: string }): Promise<{ success: boolean, message: string }> => {
    try {
      const res: { user: User, token: string, success: true } | { success: false, message: string } = await loginUser(data);

      if (res.success) {
        // נשמור את הנתונים שהגיעו מהשרת
        updateUser({ ...res.user, 'token': res.token })
        localStorage.setItem("token", res.token);
        // setUser({ ...res.user, 'token': res.token });
        // localStorage.setItem("userData", JSON.stringify({ ...res.user, 'token': res.token }));

        const ngo: Ngo = await getNgoProfile(res.token, res.user?.ngoId);
        if (ngo) {
          updateNgo(ngo)
        }
        return { success: res.success, message: '' };
      } else {
        return { success: res.success, message: res.message };
      }

    } catch (err) {
      console.error("Login failed", err);
      return { success: false, message: "פרטי ההתחברות שגויים" };
    }
  };


  const register = async (data: any): Promise<boolean> => {
    try {
      const res = await registerUserExistingNgo(data);
      return !!res.success;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const logout = () => {

    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
  };
  console.log(user);

  return (
    <AuthContext.Provider value={{ ngo, user, login, register, logout, updateUser, updateNgo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
