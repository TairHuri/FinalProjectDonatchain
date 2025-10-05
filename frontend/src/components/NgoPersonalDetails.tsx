import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, inputStyle, menuBtnStyle, primaryBtnStyle } from "../css/dashboardStyles"
import type { Ngo } from "../models/Ngo";

const NgoPersonalDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit" | "password") => void }) => {
  const { ngo } = useAuth()
  if (!ngo) return <p>לא בוצעה התחברות</p>
  const [formData, setFormData] = useState<Ngo>({ ...ngo });
  const handleSaveChanges = () => {
    if (!formData.name || !formData._id) {
      alert("יש למלא את כל השדות");
      return;
    }
    console.log(formData)
  };

  const handleChange = (field:string, value:string|number) =>{
    setFormData({ ...formData, [field]:value })
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        פרטים אישיים
      </h2>
      {ngo ? (
        <>
          {editMode === "view" && (
            <div>
              <p><strong>שם העמותה:</strong> {ngo.name}</p>
              <p><strong>מספר עמותה:</strong> {ngo._id}</p>
              <p><strong>אימייל:</strong> {ngo.email}</p>
              <p><strong>טלפון:</strong> {ngo.phone}</p>
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
              <InputText field='name' value={formData.name} placeholder="שם העמותה" onChange={handleChange}/>
              <InputText field='ngoNumber' value={formData.ngoNumber} placeholder="מספר העמותה" onChange={handleChange}/>
              
              <InputText field='email' type="email" value={formData.email||""} placeholder="אימייל" onChange={handleChange}/>
              <InputText field='phone' type="tel" value={formData.phone||""} placeholder="טלפון" onChange={handleChange}/>
              <InputText field='address' value={formData.address||""} placeholder="כתובת" onChange={handleChange}/>
              <InputText field='description' value={formData.description||""} placeholder="תיאור" onChange={handleChange}/>
              <InputText field='website' value={formData.website||""} placeholder="אתר" onChange={handleChange}/>
              <InputText field='logoUrl' value={formData.logoUrl||""} placeholder="לןגן" onChange={handleChange}/>
              <InputText field='bankAccount' value={formData.bankAccount||""} placeholder="חשבון בנק" onChange={handleChange}/>
              <InputText field='wallet' value={formData.wallet||""} placeholder="ארנק" onChange={handleChange}/>
             
         
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

const InputText = ({field,value,placeholder, onChange,type="text"}:{placeholder:string,field:string, onChange(field:string, value:string|number):void, type?:"text"|'number'|'email'|'tel'|'password', value:string|number}) => {

  return (
    <input
      type={type}
      value={value}
      onChange={(e) =>  onChange( field, e.target.value )}
      placeholder={placeholder}
      style={inputStyle}
    />
  )
}
export default NgoPersonalDetails;