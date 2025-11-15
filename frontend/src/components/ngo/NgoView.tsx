import { primaryBtnStyle } from "../../css/dashboardStyles";
import type { Ngo } from "../../models/Ngo";

export type NgoViewProps = {
    ngo: Ngo;
    setEditMode: (mode: 'edit' | 'view') => void
}
const NgoView = ({ ngo, setEditMode }: NgoViewProps) => {
    const CERTIFICATES_URL = import.meta.env.VITE_CERTIFICATES_URL || "http://localhost:4000/certificates";
    const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
    return (
        <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                פרטי העמותה
            </h2>
            <img src={`${IMAGE_URL}/${ngo.logoUrl}`} alt="ngo logo" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
            <p><strong>שם העמותה:</strong> {ngo.name}</p>
            <p><strong>מספר העמותה:</strong> {ngo.ngoNumber}</p>
            <p><strong>אימייל:</strong> {ngo.email}</p>
            <p><strong>טלפון:</strong> {ngo.phone}</p>
            <p><strong>כתובת:</strong> {ngo.address}</p>
            <p><strong>חשבון בנק:</strong> {ngo.bankAccount}</p>
            <p><strong>ארנק:</strong> {ngo.wallet}</p>
            <p><strong>תיאור:</strong> {ngo.description}</p>
            <p><strong>קטגוריות:</strong> {(ngo.tags || []).join(", ") || "-"}</p>
            {ngo.certificate && <p><strong><a href={`${CERTIFICATES_URL}/${ngo.certificate}`} target="_blank">אישור עמותה</a></strong></p>}
            <button
                onClick={() => setEditMode("edit")}
                style={{ ...primaryBtnStyle, marginTop: "15px" }}>
                עריכת פרטים
            </button>

        </div>
    )
}

export default NgoView;