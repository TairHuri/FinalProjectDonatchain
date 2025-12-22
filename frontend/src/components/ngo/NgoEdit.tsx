import { useState } from "react";
import InputText from "../gui/InputText";
import type { Ngo, NgoMediaType } from "../../models/Ngo";
import AlertDialog, { useAlertDialog } from "../gui/AlertDialog";
import { editNgo, getNgoTags } from "../../services/ngoApi";

import { inputStyle, primaryBtnStyle,ngoDetailsTitle } from "../../css/general/dashboardStyles";
import Tags from "../gui/Tags";
import Spinner, { useSpinner } from "../gui/Spinner";

export type NgoEditProps = {
    token: string;
    ngoDetails: Ngo;
    updateNgo: (ngo: Ngo) => void;                      // Callback to update NGO data in parent component
    setEditMode: (mode: 'edit' | 'view') => void        // Toggle edit/view mode
}

const NgoEdit = ({ token, ngoDetails, updateNgo, setEditMode }: NgoEditProps) => {
   
    // Alert handler hook for user notifications
    const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();
  // Current editable NGO object
    const [ngo, setNgo] = useState<Ngo>({ ...ngoDetails });
   // Media upload fields: NGO logo + certificate PDF
    const [media, setMedia] = useState<NgoMediaType>({ logoUrl: null, certificate: null });

    const {start, stop, isLoading} = useSpinner()

    // Handle media file selection (logo / certificate)
    const handleChangeMedia = (field: keyof NgoMediaType, value: FileList | null) => {
        setMedia({ ...media, [field]: value ? value[0] : null });
    };
    // Save NGO updates (including media uploads)
    const handleSaveChanges = async () => {
        if (!ngo.name || !ngo._id) {
            setAlert("יש למלא את כל השדות", true);
            return;
        }
        if (!token) {
            return null;
        }
        start();

        try {
            const res = await editNgo(ngo, token, media);
            if (res) {
                setAlert("העמותה עודכנה בהצלחה", false);
                updateNgo(res);
                setNgo(res)
                setMedia({ logoUrl: null, certificate: null })
            }
        } catch (error) {
            setAlert('לא ניתן לעדכן שלב זה' + '\n' + (error as any).message, true);
        }finally{
            stop();
        }
    };

    // Handle text fields change (generic for all fields)
    const handleChange = (field: string, value: string | number | string[]) => {
        setNgo({ ...ngo, [field]: value })
    }
     // When update succeeds, exit edit mode and clear alert
    const handleUpdateSuccess = () => {
        clearAlert();
        setEditMode('view');
    }
    if(isLoading) return <div style={{display:'flex', alignItems:'center', height:'100%'}}><Spinner /></div>
    return (
        <div>
            <h2 style={ngoDetailsTitle}>
                עריכת פרטי העמותה
            </h2>
            <InputText field='name' value={ngo.name} placeholder="שם העמותה" onChange={handleChange} />
            <InputText disabled={true} field='ngoNumber' value={ngo.ngoNumber} placeholder="מספר העמותה" onChange={handleChange} />
            <InputText field='email' type="email" value={ngo.email || ""} placeholder="אימייל" onChange={handleChange} />
            <InputText field='phone' type="tel" value={ngo.phone || ""} placeholder="טלפון" onChange={handleChange} />
            <InputText field='address' type="text" value={ngo.address || ""} placeholder="כתובת" onChange={handleChange} />
            <InputText field='bankAccount' type="text" value={ngo.bankAccount || ""} placeholder="חשבון בנק" onChange={handleChange} />
            <InputText field='wallet' type="text" value={ngo.wallet || ""} placeholder="ארנק" onChange={handleChange} />
            <InputText field='description' isMultiLine={true} value={ngo.description || ""} placeholder="תיאור" onChange={handleChange} />
            <Tags tagLoader={getNgoTags} tags={ngo.tags} handleChange={handleChange} maxTags={1}/>
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
            <AlertDialog message={message} isFailure={isFailure} show={showAlert} failureOnClose={clearAlert} successOnClose={handleUpdateSuccess} />
        </div>
    )
}

export default NgoEdit;