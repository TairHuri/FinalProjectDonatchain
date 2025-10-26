
import { buttonStyle, labelStyle, primaryBtnStyle } from "../css/dashboardStyles";
import { useNavigate } from 'react-router-dom'
import type { Ngo } from "../models/Ngo";

import '../css/NgoItem.css'


const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
const NgoItem = ({ ngo, isFlex=false }: { ngo: Ngo, isFlex?:boolean }) => {
    const nav = useNavigate();

    return (
        <div className={isFlex?'ngo-flex-item' :'ngo-grid-item'}>
            <img
                src={`${IMAGE_URL}/${ngo.logoUrl}`}
                alt={ngo.name}
                style={{ height: "80px", objectFit: "contain", marginBottom: "12px" }}
            />
            <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>{ngo.name}</h2>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>{ngo.website}</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>📍 {ngo.address}</p>
        </div>
    )
}

export const NgoFlexItem = ({ ngo }: { ngo: Ngo }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <NgoItem ngo={ngo} isFlex={true}/>
        </div>
    )
}

export default NgoItem;