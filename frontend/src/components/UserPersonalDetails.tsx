import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, inputStyle, menuBtnStyle, primaryBtnStyle } from "../css/dashboardStyles"

import InputText from "./gui/InputText";
import type { User } from "../models/User";
import { editUser } from "../services/userApi";

const UserPersonalDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit" | "password") => void }) => {
  const { user, updateUser } = useAuth()
  if (!user) return <p>לא בוצעה התחברות</p>
  const [formData, setFormData] = useState<User>({ ...user });
  const handleSaveChanges =async () => {
    if (!formData.name || !formData._id) {
      alert("יש למלא את כל השדות");
      return;
    }
    console.log(formData);
    try{
      const user = await editUser(formData);
      updateUser(user);
      setEditMode('view');
    }catch(error){
      alert((error as any).message)
    }
  };

  const handleChange = (field:string, value:string|number) =>{
    setFormData({ ...formData, [field]:value })
    
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        פרטים אישיים
      </h2>
      {user ? (
        <>
          {editMode === "view" && (
            <div>
              <p><strong>שם חבר העמותה:</strong> {user.name}</p>
              <p><strong>אימייל:</strong> {user.email}</p>
              <p><strong>טלפון:</strong> {user.phone}</p>
              <p><strong>תפקיד:</strong> {user.role}</p>
              <p><strong>סיסמה:</strong> {user.password}</p>
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
              <InputText field='name' value={formData.name} placeholder="שם חבר העמותה" onChange={handleChange}/>
              <InputText field='email' type="email" value={formData.email||""} placeholder="אימייל" onChange={handleChange}/>
              <InputText field='phone' type="tel" value={formData.phone||""} placeholder="טלפון" onChange={handleChange}/>
             
         
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


export default UserPersonalDetails;