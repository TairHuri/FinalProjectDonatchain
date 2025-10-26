import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCampaigns, createCampaign, getCampaign } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type { Campaign } from "../models/Campaign";



interface CampaignsContextType {
  campaigns: Campaign[];
  addCampaign: (c: Omit<Campaign, "raised">,images:File[]|null, movie:File|null, mainImage:File|null) => Promise<boolean>; // ← פרמטר אחד בלבד
  refreshCampaigns: () => Promise<void>;
  updateCampaign: (campaignId:string) => Promise<void>;
  postUpdateCampaign: (campaign: Campaign) =>void;
}


const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { user } = useAuth();

const refreshCampaigns = async () => {
  try {
    console.log("Fetching campaigns for NGO:", user);
    const data = await getCampaigns(user?.ngoId);
    console.log("Campaigns received:", data);
    setCampaigns(data.items);
  } catch (err) {
    console.error("Failed to fetch campaigns:", err);
  }
};

const updateCampaign = async (campaignId: string) =>{
  const campaign:Campaign = await getCampaign(campaignId)
  setCampaigns(prev => [...prev.filter(c => c._id !== campaignId), campaign])
}
const postUpdateCampaign = (campaign: Campaign) =>{
  
  setCampaigns(prev => [...prev.filter(c => c._id !== campaign._id), campaign])
}

  useEffect(()=>{
      refreshCampaigns();
    
  }, [user])
   const addCampaign = async (c: Omit<Campaign, "raised">, images:File[]|null, movie:File|null,mainImage:File|null) => {
    try {
      if (!user?.token) throw new Error("NGO not logged in");
      const campaign =await createCampaign(c, user.token, images, movie,mainImage);
      await refreshCampaigns();
      return true
    } catch (err) {
      console.error("Error creating campaign:", err);
      return false;
    }
  }

  return (
    <CampaignsContext.Provider value={{ campaigns, addCampaign, refreshCampaigns, updateCampaign, postUpdateCampaign }}>
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaigns חייב להיות בתוך CampaignsProvider");
  return ctx;
}
