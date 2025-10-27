import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, inputStyle, menuBtnStyle, primaryBtnStyle } from "../css/dashboardStyles"
import type { Ngo } from "../models/Ngo";
import InputText from "./gui/InputText";
import { editNgo } from "../services/ngoApi";

const NgoPersonalDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit" | "password") => void }) => {
    const { ngo: ngoDetails, user, updateNgo } = useAuth()
    
    if (!user || !ngoDetails) return <p>לא בוצעה התחברות לעמותה</p>
    const {token} = user;
    const [logo, setLogo] = useState<File | null>(null)
    const [ngo, setNgo] = useState<Ngo>({ ...ngoDetails });

    const handleSaveChanges = async () => {
        if (!ngo.name || !ngo._id) {
            alert("יש למלא את כל השדות");
            return;
        }

        console.log(ngo)
        if (!token) {
            return null;
        }

        try{const res = await editNgo(ngo, token, logo);
        if (res) {
            updateNgo(res);
            setEditMode('view');
        }}catch(error){
            console.log((error as any).message);
            alert('לא ניתן לעדכן שלב זה' +'\n'+  (error as any).message)
        }
    };

    const handleChange = (field: string, value: string | number) => {
        setNgo({ ...ngo, [field]: value })
    }
    const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
    return (
        <div style={cardStyle}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                פרטי העמותה
            </h2>
            <img src={`${IMAGE_URL}/${ngo.logoUrl}`} alt="ngo logo" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
            {ngo ? (
                <>
                    {editMode === "view" && (
                        <div>
                            <p><strong>שם העמותה:</strong> {ngo.name}</p>
                            <p><strong>מספר העמותה:</strong> {ngo.ngoNumber}</p>
                            <p><strong>אימייל:</strong> {ngo.email}</p>
                            <p><strong>טלפון:</strong> {ngo.phone}</p>
                            <p><strong>כתובת:</strong> {ngo.address}</p>
                            <p><strong>חשבון בנק:</strong> {ngo.bankAccount}</p>
                            <p><strong>ארנק:</strong> {ngo.wallet}</p>
                            <p><strong>תיאור:</strong> {ngo.description}</p>
                            <button
                                onClick={() => setEditMode("edit")}
                                style={{ ...primaryBtnStyle, marginTop: "15px" }}
                            >
                                עריכת פרטים
                            </button>
                        </div>
                    )}

                    {editMode === "edit" && (
                        <div>
                            <InputText field='name' value={ngo.name} placeholder="שם העמותה" onChange={handleChange} />
                            <InputText field='ngoNumber' value={ngo.ngoNumber} placeholder="מספר העמותה" onChange={handleChange} />
                            <InputText field='email' type="email" value={ngo.email || ""} placeholder="אימייל" onChange={handleChange} />
                            <InputText field='phone' type="tel" value={ngo.phone || ""} placeholder="טלפון" onChange={handleChange} />
                            <InputText field='address' type="text" value={ngo.address || ""} placeholder="כתובת" onChange={handleChange} />
                            <InputText field='bankAccount' type="text" value={ngo.bankAccount || ""} placeholder="חשבון בנק" onChange={handleChange} />
                            <InputText field='wallet' type="text" value={ngo.wallet || ""} placeholder="ארנק" onChange={handleChange} />
                            <InputText field='description' isMultiLine={true} value={ngo.description || ""} placeholder="תיאור" onChange={handleChange} />
                            <label>לוגו עמותה :</label>
                            <input type="file" accept="image/*"
                                onChange={(e) => setLogo(e.target.files ? e.target.files![0] : null)} style={inputStyle} />

                            {logo && <img src={URL.createObjectURL(logo)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={handleSaveChanges} style={primaryBtnStyle}>שמור</button>
                                <button onClick={() => setEditMode("view")} style={{ ...menuBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
            )}
        </div>
    )

}


export default NgoPersonalDetails;