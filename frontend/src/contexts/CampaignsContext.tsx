import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCampaigns, createCampaign, getCampaign } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export interface Campaign {
  _id?: string;
  title: string;
  goal: number;
  raised: number;
  numOfDonors: number;
  startDate: string;
  endDate: string;
  description: string;
  ngoLogo?: string;
  image?: string;
  video?: string;
  gallery?: string[];
  ngo:string;
}

interface CampaignsContextType {
  campaigns: Campaign[];
  addCampaign: (c: Omit<Campaign, "raised">) => Promise<boolean>; // ← פרמטר אחד בלבד
  refreshCampaigns: () => Promise<void>;
  updateCampaign: (campaignId:string) => Promise<void>;
}


const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { ngo } = useAuth();

const refreshCampaigns = async () => {
  try {
    console.log("Fetching campaigns for NGO:", ngo?._id);
    const data = await getCampaigns(ngo?._id);
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

  useEffect(()=>{
      refreshCampaigns();
    
  }, [])
   const addCampaign = async (c: Omit<Campaign, "raised">) => {
    try {
      if (!ngo?.token) throw new Error("NGO not logged in");
      const campaign =await createCampaign(c, ngo.token);
      await refreshCampaigns();
      return true
    } catch (err) {
      console.error("Error creating campaign:", err);
      return false;
    }
  }

  return (
    <CampaignsContext.Provider value={{ campaigns, addCampaign, refreshCampaigns, updateCampaign }}>
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaigns חייב להיות בתוך CampaignsProvider");
  return ctx;
}
