import type { Campaign } from "../models/Campaign";
import { buttonStyle, labelStyle, primaryBtnStyle } from "../css/dashboardStyles";
import { useNavigate } from 'react-router-dom'
import type { Ngo } from "../models/Ngo";


const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};
const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
const CampaignItem = ({ c, showButtons=false, edit=(id:string)=>{} }: { c: Campaign, showButtons?:boolean, edit?:(id:string)=>void }) => {
    const nav = useNavigate();

    return (
        <div key={c._id} style={cardStyle}>
            <img src={`${IMAGE_URL}/${c.mainImage||(c.ngo as unknown as Ngo).logoUrl}`} alt="קמפיין" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />

            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>{c.title}</h3>
            <p>{c.raised.toLocaleString()} ₪ מתוך {c.goal.toLocaleString()} ₪</p>
            <div style={{ background: "#e5e7eb", borderRadius: "8px", overflow: "hidden", height: "8px", marginTop: "5px" }}>
                <div style={{ width: `${(c.raised / c.goal) * 100}%`, background: "#10b981", height: "100%" }}></div>
            </div>
            {showButtons && <div style={{display:'flex', justifyContent:'space-between'}}>
                <button style={{ ...primaryBtnStyle, width: '18vw' }} disabled={c._id === undefined} onClick={()=>edit(c._id!)}>עריכה</button>
                <button style={{ ...primaryBtnStyle, width: '18vw' }} onClick={()=>nav(`/campaign/${c._id}`)}>צפייה</button>
            </div>}
        </div>
    )
}

export const CampaignDonors = ({ campaign, onClick }: { campaign: Campaign, onClick: () => Promise<void> }) => {
    return (<p>{campaign.title} <button type="button" onClick={onClick} style={buttonStyle}>תורמי הקמפיין</button></p>)
}
export default CampaignItem;