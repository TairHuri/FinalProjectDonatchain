const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function toggleAdminCampaignStatus(token: string, campaignId:string) {
  const res = await fetch(`${API_URL}/admin/campaigns/${campaignId}`, {
    method:'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function toggleAdminNgoStatus(token: string, campaignIds:string[],isActive:boolean, ngoId:string) {
  const res = await fetch(`${API_URL}/admin/ngos/${ngoId}`, {
    method:'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({campaignIds, isActive})
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}