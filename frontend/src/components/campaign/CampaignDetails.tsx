import { useEffect, useState } from 'react'
import CampaignView from "./CampaignView"
import { useCampaigns } from '../../contexts/CampaignsContext'
import type { Campaign } from '../../models/Campaign'
import { useAuth } from '../../contexts/AuthContext'
import CampaignEdit, { type SetCampaign } from './CampaignEdit'


export type CampaignDetailsType = {
    campaignId: string,
    editMode: string,
    setEditMode: (mode: "view" | "edit" ) => void
}
const CampaignDetails = ({ campaignId, editMode, setEditMode }: CampaignDetailsType) => {
    const { user } = useAuth()
    const { campaigns } = useCampaigns();
    const [campaign, setCampaign] = useState<Campaign | null>();


    // Load campaign data when campaigns list updates
    useEffect(() => {
        const c = campaigns.find((x) => x._id! === (campaignId));
        if (c) {
            setCampaign(c)
        }
    }, [campaigns])

   // If user is not logged in, access should be denied
    if (!user) return <p>לא בוצעה התחברות</p>
    // If campaign doesn't exist, show a fallback message
    if (!campaign) return <p>קמפיין לא נמצא</p>;
    return (
        <>
            {user ? (
                // Allow switching between view and edit modes based on `editMode` state
                editMode === "view" ? 
                <CampaignView campaign={campaign} setEditMode={setEditMode} setCampaign={setCampaign} token={user.token!} userRole={user.role} />
                 : 
                 <CampaignEdit setEditMode={setEditMode} campaign={campaign} setCampaign={setCampaign as unknown as SetCampaign} token={user.token!} />
            ) 
            :
            (
 
                 // Fallback if user session expired or invalid
                <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
            )}
        </>
    )
}


export default CampaignDetails;