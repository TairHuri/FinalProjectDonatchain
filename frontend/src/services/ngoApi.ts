import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
import type { Ngo, NgoMediaType } from "../models/Ngo";
import type { User } from "../models/User";

// Verify if an NGO number exists in the system
export async function verifyNgoNumber(ngoNumber: string){
  try{
    const httpResponse = await fetch(`${API_URL}/ngos/verify/${ngoNumber}`);
    if(!httpResponse.ok){
      const resp = await httpResponse.json()
      return {status:false, message:resp.message}
    }
    return {status: true, message:null};
  }catch(error){
    console.log(error);
    
    return {status:false, message: 'שגיאה בקריאה לשרת'}
  }
  
}
// Edit an existing NGO and update its media (logo, certificate, etc.)

export async function editNgo(ngo: Ngo, token: string,  media: NgoMediaType) {
   const formData = new FormData()
  formData.append("name", ngo.name)
  formData.append("description", ngo.description)
  ngo.address && formData.append("address", ngo.address)
  ngo.phone && formData.append("phone", ngo.phone)
  ngo.email && formData.append("email", ngo.email)
  ngo.website && formData.append("website", ngo.website)
  ngo.bankAccount && formData.append("bankAccount", ngo.bankAccount)
  ngo.ngoNumber && formData.append("ngoNumber", ngo.ngoNumber)
  if(media.certificate){
    formData.append("certificate", media.certificate);
  }
  for(const tag of ngo.tags){        
        formData.append("tags", tag)
    }
  if (media.logoUrl) {
    formData.append("logo", media.logoUrl)
  }

  const res = await fetch(`${API_URL}/ngos/${ngo._id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });
  if (res.status >= 400) {
    const err = await res.json()
    throw new Error(err.message)
  }
  return res.json();
}

// Toggle NGO active/inactive status (admin functionality)
export async function toggleNgoStatus(id: string, token: string) {
  const res = await fetch(`${API_URL}/ngos/${id}/toggle-status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "שגיאה בעדכון הסטטוס");
  }
  return res.json();
}


// Fetch a single NGO by its ID
export const getNgoById = async ( ngoId:string): Promise<Ngo> => {
  const res = await axios.get<Ngo>(`${API_URL}/ngos/${ngoId}`, {

  });

  return res.data; 
};
// Get all NGO tags for filtering/tag selection
export async function getNgoTags() {
  const res = await fetch(`${API_URL}/ngos/tags`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


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

