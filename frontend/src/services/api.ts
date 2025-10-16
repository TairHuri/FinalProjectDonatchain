import axios from "axios";
import type { Ngo } from "../models/Ngo";
import type { User } from "../models/User";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function registerUserNewNgo(user:User, ngo:Ngo) {
  try {
    const res = await fetch(`${API_URL}/auth/register/newngo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({user, ngo}),
    });

    const json = await res.json(); // נקרא תמיד את התגובה, גם אם status != 200

    if (!res.ok) {
      return { success: false, message: json.message || `שגיאת שרת: ${res.status}` };
    }

    return json;
  } catch (err: any) {
    return { success: false, message: err.message ?? "שגיאה לא צפויה" };
  }
}
export async function registerUserExistingNgo(user:User) {
  try {
    const res = await fetch(`${API_URL}/auth/register/existingngo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({user}),
    });

    const json = await res.json(); // נקרא תמיד את התגובה, גם אם status != 200

    if (!res.ok) {
      return { success: false, message: json.message || `שגיאת שרת: ${res.status}` };
    }

    return json;
  } catch (err: any) {
    return { success: false, message: err.message ?? "שגיאה לא צפויה" };
  }
}


export const getNgoList = async (): Promise<{items:Ngo[]}> => {
  const res = await axios.get<{items:Ngo[]}>(`${API_URL}/ngos`);

  return res.data; // ✅ עכשיו TypeScript יודע שזה NgoProfileResponse
};

export const getNgoProfile = async (token: string): Promise<Ngo> => {
  const res = await axios.get<Ngo>(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // ✅ עכשיו TypeScript יודע שזה NgoProfileResponse
};
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function getUsers(ngoId:string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/ngo/${ngoId}`, {headers:{"Authorization": `Bearer ${token}`}})
  return res.json();
}
export async function approveUserApi(userId:string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/approve/${userId}`, {method:'PATCH', headers:{"Authorization": `Bearer ${token}`}})
  return res.json();
}
export async function deleteUserApi(userId:string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/${userId}`, {method:'DELETE', headers:{"Authorization": `Bearer ${token}`}})
  return res.json();
}

export async function createCampaign(data: any, token: string) {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if(res.status != 201){
    throw new Error(await res.text())
  }
  return res.json();
}

export const getCampaigns = async (ngoId?: string) => {
  const url = ngoId
    ? `${API_URL}/campaigns?ngoId=${ngoId}`  // שים לב לשימוש ב-query param
    : `${API_URL}/campaigns`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error("Failed fetching campaigns:", text);
    return [];
  }
  const data = await res.json();
  return data;
}
export const getDonations = async (campaignId: string) => {
  const url = `${API_URL}/donations/campaign?campaignId=${campaignId}`  // שים לב לשימוש ב-query param
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Failed fetching campaigns:", text);
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return []
  }
}
export const getDonationsByNgo = async (ngoId: string) => {
  const url = `${API_URL}/donations/ngo?ngoId=${ngoId}`  // שים לב לשימוש ב-query param
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Failed fetching donations per ngo:", text);
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return []
  }
}
export const getCampaign = async (campaignId: string) => {
  const url = `${API_URL}/campaigns/${campaignId}`

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error("Failed fetching campaigns:", text);
    return null;
  }

  const data = await res.json();
  return data;
};

type CreditDonation = {
  amount: number, currency: string, ccNumber: string, expYear: number, expMonth: number, cvv: number, ownerId: string, ownername: string;
  donorNumber: string, donorEmail: string, donorFirstName: string, donorLastName: string
}
export const creditDonation = async (chargeData: CreditDonation, campaignId: string) => {
  const res = await fetch(`${API_URL}/donations/${campaignId}/credit-donate`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      //"Authorization": `Bearer ${ngo?.token}`,
    },
    body: JSON.stringify(chargeData),
  })
  const data = await res.json();
  return { data, status: res.status };
}