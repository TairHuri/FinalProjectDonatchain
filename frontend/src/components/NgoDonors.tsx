import { useEffect, useState } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import CampaignItem, { CampaignDonors } from "./CampaignItem";
import type { Donation } from "../models/Donation";

import { getDonationsByCampaign, getDonationsByNgo} from "../services/donationApi";
import { useAuth } from "../contexts/AuthContext";
import { buttonStyle } from "../css/dashboardStyles";
import { hover } from "framer-motion";



const NgoDonors = () => {
    const {user} =useAuth()
    const {campaigns} = useCampaigns()
    const [donations, setDonations] = useState<Donation[]>([]);
    const loadDonors = async (campaignId:string) => {
        const donations = await getDonationsByCampaign(campaignId);
        setDonations(donations);
    }
    const loadNgoDonors = async () => {
        if(!user)return;        
        const donations = await getDonationsByNgo(user.ngoId);
        setDonations(donations);
    }
    
    return (
        <div>
            <h2>תורמי העמותה</h2>
            <button  type='button' onClick={loadNgoDonors} style={buttonStyle}>כל התורמים </button>
            <div style={{height:'25vh', overflowY:'auto'}}>
                {campaigns.map((c) => <CampaignDonors key={c._id} campaign={c} onClick={()=>loadDonors(c._id!)}/>)}
            </div>
            <div style={{height:'30vh', overflowY:'auto'}}>
                {donations.map(d => <p key={d._id}>{`${d.firstName} ${d.lastName} ${d.email} ${d.phone}`}</p>)}
            </div>
        </div>
    )
}

export default NgoDonors