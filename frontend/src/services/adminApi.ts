const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

/**
 * Toggles the active status of a specific campaign (Admin action).
 * Sends a PATCH request to update the campaign's status.
 *
 * @param token - Admin authentication token
 * @param campaignId - ID of the campaign to update
 * @returns Updated campaign data from the server
 */
export async function toggleAdminCampaignStatus(token: string, campaignId:string) {
  const res = await fetch(`${API_URL}/admin/campaigns/${campaignId}`, {
    method:'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/**
 * Toggles the active status of an NGO and optionally updates related campaign statuses.
 * Sends a PATCH request containing campaign IDs and the new NGO status.
 *
 * @param token - Admin authentication token
 * @param campaignIds - List of campaign IDs related to the NGO
 * @param isActive - New status for the NGO (true = active, false = inactive)
 * @param ngoId - The NGO ID to update
 * @returns Updated NGO data from the server
 */
export async function toggleAdminNgoStatus(token: string, campaignIds:string[],isActive:boolean, ngoId:string) {
  const res = await fetch(`${API_URL}/admin/ngos/${ngoId}`, {
    method:'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({campaignIds, isActive})
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}