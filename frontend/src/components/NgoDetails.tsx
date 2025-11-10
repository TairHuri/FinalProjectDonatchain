import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, inputStyle, primaryBtnStyle } from "../css/dashboardStyles"
import type { Ngo, NgoMediaType } from "../models/Ngo";
import InputText from "./gui/InputText";
import { editNgo } from "../services/ngoApi";
import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";


const NgoPersonalDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit" | "password") => void }) => {
    const { ngo: ngoDetails, user, updateNgo } = useAuth()

    if (!user || !ngoDetails) return <p>לא בוצעה התחברות לעמותה</p>
    const { token } = user;

    const [ngo, setNgo] = useState<Ngo>({ ...ngoDetails });
    const [media, setMedia] = useState<NgoMediaType>({ logoUrl: null, certificate: null });
    const { showAlert, isFailure, setIsFailure, message, setMessage, setShowAlert } = useAlertDialog()

    const handleChangeMedia = (field: keyof NgoMediaType, value: FileList | null) => {
        setMedia({ ...media, [field]: value ? value[0] : null });
    };
    const handleSaveChanges = async () => {
        if (!ngo.name || !ngo._id) {
            setIsFailure(true);
            setMessage("יש למלא את כל השדות");
            setShowAlert(true);
            return;
        }

        console.log(ngo)
        if (!token) {
            return null;
        }

        try {
            const res = await editNgo(ngo, token, media);
            if (res) {
                setIsFailure(false);
                setMessage("העמותה עודכנה בהצלחה");
                setShowAlert(true);
                updateNgo(res);
                setNgo(res)
                setMedia({ logoUrl: null, certificate: null })
            }
        } catch (error) {
            console.log((error as any).message);
             setIsFailure(true);
                setMessage('לא ניתן לעדכן שלב זה' + '\n' + (error as any).message);
                setShowAlert(true);

        }
    };

    const handleChange = (field: string, value: string | number) => {
        setNgo({ ...ngo, [field]: value })
    }
    const handleUpdateSuccess = () => {
        setEditMode('view');
        setShowAlert(false);
    }
    const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
    const CERTIFICATES_URL = import.meta.env.VITE_CERTIFICATES_URL || "http://localhost:4000/certificates";
    return (
        <div style={cardStyle}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                פרטי העמותה
            </h2>
            <AlertDialog message={message} isFailure={isFailure} show={showAlert} failureOnClose={()=>setShowAlert(false)} successOnClose={handleUpdateSuccess} />
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
                            {ngo.certificate && <p><strong><a href={`${CERTIFICATES_URL}/${ngo.certificate}`} target="_blank">אישור עמותה</a></strong></p>}
                            <button
                                onClick={() => setEditMode("edit")}
                                style={{ ...primaryBtnStyle, marginTop: "15px" }}>
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
                                onChange={(e) => handleChangeMedia("logoUrl", e.target.files)} style={inputStyle} />

                            {media.logoUrl && <img src={URL.createObjectURL(media.logoUrl)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}
                            <label>אישור עמותה :</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => handleChangeMedia("certificate", e.target.files)}
                                style={inputStyle}
                            />

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={handleSaveChanges} style={primaryBtnStyle}>שמור</button>
                                <button onClick={() => setEditMode("view")} style={{ ...primaryBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
            )
            }
        </div >
    )

}


export default NgoPersonalDetails;