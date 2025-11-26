import axios from "axios";
import type { Ngo, NgoMediaType } from "../models/Ngo";
import type { User } from "../models/User";
import type { Campaign } from "../models/Campaign";
import type { CreditDonation, Donation } from "../models/Donation";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Registers a new NGO and a new user together.
 * Sends multipart/form-data including user data, NGO details, and media files.
 *
 * @param user - The user data to register
 * @param ngo - NGO details
 * @param media - NGO media files (logo, certificate, optional)
 * @returns Server response with success or error message
 */
export async function registerUserNewNgo(user: User, ngo: Ngo, media: NgoMediaType) {
  const formData = new FormData();
  formData.append("userJson", JSON.stringify(user));
  formData.append("name", ngo.name);
  formData.append("description", ngo.description);
  formData.append("ngoNumber", ngo.ngoNumber);
  formData.append("certificate", media.certificate!);
  if (ngo.website) formData.append("website", ngo.website);
  if (ngo.bankAccount) formData.append("bankAccount", ngo.bankAccount);
  if (ngo.wallet) formData.append("wallet", ngo.wallet);
  if (ngo.address) formData.append("address", ngo.address);
  if (ngo.phone) formData.append("phone", ngo.phone);
  if (ngo.email) formData.append("email", ngo.email);

  if (media.logoUrl) formData.append("logo", media.logoUrl);
  for(const tag of ngo.tags){        
        formData.append("tags", tag)
    }

  try {
    const res = await fetch(`${API_URL}/auth/register/newngo`, {
      method: "POST",
      body: formData,
    })

    const json = await res.json(); // נקרא תמיד את התגובה, גם אם status != 200

    if (!res.ok) {
      return { success: false, message: json.message || `שגיאת שרת: ${res.status}` };
    }

    return json;
  } catch (err: any) {
    return { success: false, message: err.message ?? "שגיאה לא צפויה" };
  }
}

/**
 * Registers a user under an existing NGO.
 *
 * @param user - User registration data
 * @returns Server response with success or error message
 */
export async function registerUserExistingNgo(user: User) {
  try {
    const res = await fetch(`${API_URL}/auth/register/existingngo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
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

/**
 * Retrieves a list of all NGOs.
 *
 * @returns A list of NGOs as a typed response
 */
export const getNgoList = async (): Promise<{ items: Ngo[] }> => {
  const res = await axios.get<{ items: Ngo[] }>(`${API_URL}/ngos`);

  return res.data; 
};

/**
 * Logs in a user using email and password.
 *
 * @param data - Login credentials
 * @returns Authentication result including token if successful
 */
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Retrieves users belonging to a specific NGO.
 *
 * @param ngoId - The NGO ID
 * @returns List of users under that NGO
 */
export async function getUsers(ngoId: string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/ngo/${ngoId}`, { headers: { "Authorization": `Bearer ${token}` } })
  return res.json();
}

/**
 * Approves a user under an NGO (Admin/NGO manager action).
 *
 * @param userId - ID of the user to approve
 * @returns Updated user or status
 */
export async function approveUserApi(userId: string) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${API_URL}/users/approve/${userId}`, { method: 'PATCH', headers: { "Authorization": `Bearer ${token}` } })
  return res.json();
}

/**
 * Creates a new campaign with images, videos, and metadata.
 * Uses multipart/form-data for media upload.
 *
 * @param data - Campaign data excluding "raised"
 * @param token - Authorization token
 * @param images - Optional list of campaign images
 * @param movie - Optional video file
 * @param mainImage - Optional main image file
 * @returns Created campaign data
 */
export async function createCampaign(data: Omit<Campaign, "raised">, token: string, images: File[] | null, movie: File | null, mainImage: File | null) {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description)
  formData.append("ngo", data.ngo)
  formData.append("blockchainTx", data.blockchainTx!)
  formData.append("goal", `${data.goal}`)
  if (images) {
    for (const image of images) {
      formData.append("images", image)
    }
  }
  if (movie) {
    formData.append("movie", movie)
  }
  if (mainImage) {
    formData.append("mainImage", mainImage)
  }
  formData.append("startDate", data.startDate)
  formData.append("endDate", data.endDate)
  for(const tag of data.tags){
    formData.append('tags', tag)
  }
  formData.append("isActive", `${data.isActive}`)
  const res = await fetch(`${API_URL}/campaigns`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (res.status != 201) {
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

/**
 * Retrieves campaigns, optionally filtered by NGO.
 *
 * @param ngoId - Optional NGO ID to filter by
 * @returns List of campaigns
 */
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

/**
 * Submits a credit card donation.
 *
 * @param chargeData - Payment data
 * @param campaignId - ID of the campaign being donated to
 * @returns Response data and status
 */
export const creditDonation = async (chargeData: CreditDonation, campaignId: string) => {
  const res = await fetch(`${API_URL}/donations/${campaignId}/credit-donate`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
 },
    body: JSON.stringify(chargeData),
  })
  const data = await res.json();
  return { data, status: res.status };
}
/**
 * Submits a crypto donation.
 *
 * @param chargeData - Donation details
 * @param campaignId - ID of the campaign
 * @returns Response data and status
 */
export const cryptoDonation = async (chargeData: Donation, campaignId: string) => {
  const res = await fetch(`${API_URL}/donations/${campaignId}/donate`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
   },
    body: JSON.stringify(chargeData),
  })
  const data = await res.json();
  return { data, status: res.status };
}