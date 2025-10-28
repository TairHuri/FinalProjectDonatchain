

import { useNavigate, Link } from 'react-router-dom'
import type { Ngo } from "../models/Ngo";

import '../css/NgoItem.css'


const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
const NgoItem = ({ ngo, view }: { ngo: Ngo, view: "grid" | "list" }) => {

    return (
        <Link
            to={`/ngos/${ngo._id}`}
            className='ngo-link_item'
        >
            <div className={view == 'list' ? 'ngo-flex-item' : 'ngo-grid-item'}>
                <img
                    src={`${IMAGE_URL}/${ngo.logoUrl}`}
                    alt={ngo.name}
                    style={{ height: "80px", objectFit: "contain", marginBottom: "12px" }}
                />
                <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>{ngo.name}</h2>

                <p style={{ fontSize: "14px", color: "#6b7280" }}>{ngo.website}</p>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>📍 {ngo.address}</p>
            </div>
        </Link>
    )
}

export default NgoItem;