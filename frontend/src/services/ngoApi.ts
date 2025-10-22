import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
import type { Ngo } from "../models/Ngo";

export async function editNgo(ngo: Ngo, token: string, logo: File|null) {
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

  if (logo) {
    formData.append("logo", logo)
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