import type { Campaign } from "../contexts/CampaignsContext";


const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const CampaignItem = ({ c }: { c: Campaign }) => {

    return (
        <div key={c._id} style={cardStyle}>
            <img src={c.image} alt="קמפיין" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>{c.title}</h3>
            <p>{c.raised.toLocaleString()} ₪ מתוך {c.goal.toLocaleString()} ₪</p>
            <div style={{ background: "#e5e7eb", borderRadius: "8px", overflow: "hidden", height: "8px", marginTop: "5px" }}>
                <div style={{ width: `${(c.raised / c.goal) * 100}%`, background: "#10b981", height: "100%" }}></div>
            </div>
        </div>
    )
}

export const CampaignDonors = ({campaign, onClick}:{campaign: Campaign, onClick:()=>Promise<void>}) => {
    return (<p >{campaign.title} <button type="button" onClick={onClick}>תורמי הקמפיין</button></p>)
}
export default CampaignItem;