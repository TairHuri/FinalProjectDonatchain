import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, getNgoProfile, registerUserExistingNgo } from "../services/api";

import type { User } from "../models/User";



interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<{success:boolean, message:string}>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({success:true, message:''}),
  register: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);


useEffect(() => {
  const savedUser = localStorage.getItem("userData");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);


//   const fetchNgoData = async (token: string) => {
//   try {
//     const res = await getNgoProfile(token); // קריאת פרופיל מהשרת
//     if (res) {
//       const userData: User = {
//         name: res.name ?? "",
//         _id: res._id ?? "",
//         email: res.email ?? "",
//         phone: res.phone ?? "",



//         createdAt: res.createdAt,
//         token, // חייב להיות כי שמרנו בלוקאל סטורג'
//       };
//       setUser(ngoData);
//       localStorage.setItem("ngoData", JSON.stringify(ngoData));
//     }
//   } catch (err) {
//     console.error("Failed to fetch NGO profile", err);
//   }
// };

const login = async (data: { email: string; password: string }): Promise<{success:boolean, message:string}> => {
  try {
    const res:{user:User, token:string, success:true}|{success:false, message:string} = await loginUser(data);

    if (res.success) {
      // נשמור את הנתונים שהגיעו מהשרת
      
      setUser({...res.user, 'token':res.token});
      localStorage.setItem("token", res.token);
      localStorage.setItem("userData", JSON.stringify({...res.user, 'token':res.token}));

      return {success:res.success, message:''};
    }else{
      return {success:res.success, message:res.message}; 
    }

  } catch (err) {
    console.error("Login failed", err);
        return {success:false, message:"פרטי ההתחברות שגויים"}; 
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
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
