import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getCampaigns, createCampaign, getCampaign } from "../services/campaignApi";
import { useAuth } from "../contexts/AuthContext";
import type { Campaign } from "../models/Campaign";


// Defines the structure of the Campaigns Context API.
// This interface enforces type safety when accessing campaigns and actions.
interface CampaignsContextType {
  campaigns: Campaign[];
 // Creates a new campaign with optional media files and uploads it to the backend
  addCampaign: (c: Omit<Campaign, "raised">,images:File[]|null, movie:File|null, mainImage:File|null) => Promise<boolean>; // ← פרמטר אחד בלבד
  // Fetches all campaigns associated with the current NGO
  refreshCampaigns: () => Promise<void>;

  // Reloads a single campaign from the backend by ID and updates local state
  updateCampaign: (campaignId: string) => Promise<void>;

  // Updates campaign state locally after an edit without calling the server again
  postUpdateCampaign: (campaign: Campaign) => void;
}

// Create Context with undefined to force safe consumption via 
const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined);

// Provider component wrapping the app and providing campaign state & actions
export function CampaignsProvider({ children }: { children: ReactNode }) {
  // Holds all campaigns of the logged-in NGO
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Access authenticated user info
  const { user } = useAuth();

  // Loads all campaigns related to the NGO from the backend
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

 // Fetches a single campaign by ID and replaces it in local state
const updateCampaign = async (campaignId: string) =>{
  const campaign:Campaign = await getCampaign(campaignId)
  setCampaigns(prev => [...prev.filter(c => c._id !== campaignId), campaign])
}

// Updates campaign locally without server request (optimistic UI handling)
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

// Custom hook for safely accessing CampaignsContext
export function useCampaigns() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaigns חייב להיות בתוך CampaignsProvider");
  return ctx;
}