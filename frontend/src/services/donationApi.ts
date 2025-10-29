const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getAllDonations = async () => {
  const url = `${API_URL}/donations`; // נתיב כללי שיחזיר את כל התרומות
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
    console.log(error);
    return [];
  }
};

export const getDonationsByCampaign = async (campaignId: string) => {
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