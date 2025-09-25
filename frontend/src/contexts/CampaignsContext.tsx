import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCampaigns, createCampaign } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface Campaign {
  _id: string;
  title: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  description: string;
  targetAmount: number;
  ngoLogo?: string;
  image?: string;
  video?: string;
  gallery?: string[];
}

interface CampaignsContextType {
  campaigns: Campaign[];
  addCampaign: (data: Omit<Campaign, "_id" | "raised">) => Promise<void>;
  refreshCampaigns: () => Promise<void>;
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

export function CampaignsProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { ngo } = useAuth();

const refreshCampaigns = async () => {
  try {
    console.log("Fetching campaigns for NGO:", ngo?._id);
    const data = await getCampaigns(ngo?._id);
    console.log("Campaigns received:", data);
    setCampaigns(data);
  } catch (err) {
    console.error("Failed to fetch campaigns:", err);
  }
};




  const addCampaign = async (data: Omit<Campaign, "_id" | "raised">) => {
    try {
      if (!ngo?.token) throw new Error("NGO not logged in");
      await createCampaign(data, ngo.token);
      await refreshCampaigns();
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  useEffect(() => {
    if (ngo) refreshCampaigns();
  }, [ngo]);

  return (
    <CampaignsContext.Provider value={{ campaigns, addCampaign, refreshCampaigns }}>
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaigns חייב להיות בתוך CampaignsProvider");
  return ctx;
}
