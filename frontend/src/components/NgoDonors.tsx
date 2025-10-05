import { useEffect, useState } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import CampaignItem, { CampaignDonors } from "./CampaignItem";
import type { Donation } from "../models/Donation";
import { getDonations, getDonationsByNgo } from "../services/api";
import { useAuth } from "../contexts/AuthContext";



const NgoDonors = () => {
    const {ngo} =useAuth()
    const {campaigns} = useCampaigns()
    const [donations, setDonations] = useState<Donation[]>([]);
    const loadDonors = async (campaignId:string) => {
        const donations = await getDonations(campaignId);
        setDonations(donations);
    }
    const loadNgoDonors = async () => {
        if(!ngo)return;
        const donations = await getDonationsByNgo(ngo._id);
        setDonations(donations);
    }
    
    return (
        <div>
            <h2>תורמי העמותה</h2>
            <button  type='button' onClick={loadNgoDonors}>כל התורמים</button>
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