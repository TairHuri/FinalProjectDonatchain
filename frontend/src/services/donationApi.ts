import type { CreditDonation, Donation } from "../models/Donation";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";


// Fetch all donations (admin/general endpoint)
export const getAllDonations = async () => {
  const url = `${API_URL}/donations`; 
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Failed fetching all donations:", text);
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fetch donations filtered by a specific campaign
export const getDonationsByCampaign = async (campaignId: string) => {
    const url = `${API_URL}/donations/campaign/ngomember?campaignId=${campaignId}`  // שים לב לשימוש ב-query param
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
        console.error(error);
        return []
    }
}

// Fetch donations filtered by a specific NGO
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
    console.error(error);
    return []
  }
}


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