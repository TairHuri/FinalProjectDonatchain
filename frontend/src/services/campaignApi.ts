import type { Campaign } from "../models/Campaign";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";


/**
 * Updates an existing campaign.
 * Sends multipart/form-data including metadata, existing media references,
 * and optional new media files.
 *
 * @param data - The full campaign object containing updated fields
 * @param token - Authorization token
 * @param images - New images to upload (optional)
 * @param movie - New video file to upload (optional)
 * @param mainImage - New main image file to upload (optional)
 * @returns The updated campaign data from the server
 * @throws Error if the server response is not status 200
 */
export async function updateCampaign(data: Campaign, token: string, images: File[] | null, movie: File | null, mainImage: File | null) {

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("startDate", data.startDate)
    formData.append("endDate", data.endDate)
    formData.append("isActive", `${data.isActive}`)
    
    for(const tag of data.tags){        
        formData.append("tags", tag)
    }
    formData.append("ngo", data.ngo)
    formData.append("blockchainTx", data.blockchainTx!)
    formData.append("goal", `${data.goal}`)
  
    for (const image of data.images) {
        formData.append("existingImages", image)
    }
    if (data.movie) {
        formData.append("existingMovie", `${data.movie}`)
    }
    if (data.mainImage) {
        formData.append("existingMainImage", `${data.mainImage}`)
    }
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

    const res = await fetch(`${API_URL}/campaigns/${data._id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    if (res.status != 200) {
        throw new Error(await res.text())
    }
    return res.json();
}

/**
 * Toggles a campaign's active status (enable/disable).
 *
 * @param id - ID of the campaign
 * @param token - Authorization token
 * @returns The updated status response
 * @throws Error if request fails
 */
export async function toggleCampaignStatus(id: string, token: string) {
  const res = await fetch(`${API_URL}/campaigns/${id}/toggle-status`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
}

/**
 * Retrieves all campaigns (admin only).
 *
 * @param token - Authorization token
 * @returns List of all campaigns
 * @throws Error if request fails
 */
export async function getAllCampaigns(token: string) {
  const res = await fetch(`${API_URL}/campaigns/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Generates and downloads a campaign report PDF.
 *
 * @param token - Authorization token
 * @param campaignId - Campaign ID
 * @param includeDonations - Whether to include donation data
 * @param includeComments - Whether to include comments
 */
export async function getCampaignReport(token: string, campaignId:string, includeDonations:string, includeComments:string) {
 const res = await fetch(`${API_URL}/campaigns/reports/${campaignId}?includeDonations=${includeDonations}&includeComments=${includeComments}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const pdfFile = await res.blob()
  const fileUrl = URL.createObjectURL(pdfFile);
  window.open(fileUrl, '_blank')
  
  
}
/**
 * Retrieves all available campaign tags.
 *
 * @returns List of tags
 * @throws Error if request fails
 */
export async function getCampaignTags() {
  const res = await fetch(`${API_URL}/campaigns/tags`);
  if (!res.ok) throw new Error(await res.text());
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
    ? `${API_URL}/campaigns?ngoId=${ngoId}`  
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