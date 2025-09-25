import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function registerUser(data: any) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
export interface NgoProfileResponse {
  name: string;
  id: string;
  email: string;
  ngoId?: string;
  phone: string;
  password?: string;
  address?: string;
  bankAccount?: string;
  wallet?: string;
  goals?: string;
}

export const getNgoProfile = async (token: string): Promise<NgoProfileResponse> => {
  const res = await axios.get<NgoProfileResponse>(`${API_URL}/auth/profile`, {
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

export async function createCampaign(data: any, token: string) {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
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
};

