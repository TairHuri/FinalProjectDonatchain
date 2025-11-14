import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
import type { Ngo, NgoMediaType } from "../models/Ngo";

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
export async function editNgo(ngo: Ngo, token: string,  media: NgoMediaType) {
  // content type: multipart/formdata
  
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

export const getNgoList = async (): Promise<{ items: Ngo[] }> => {
  const res = await axios.get<{ items: Ngo[] }>(`${API_URL}/ngos`);

  return res.data; 
};

export const getNgoById = async ( ngoId:string): Promise<Ngo> => {
  const res = await axios.get<Ngo>(`${API_URL}/ngos/${ngoId}`, {

  });

  return res.data; 
};

export async function getNgoTags() {
  const res = await fetch(`${API_URL}/ngos/tags`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}