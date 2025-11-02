import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, primaryBtnStyle } from "../css/dashboardStyles"

import InputText from "./gui/InputText";
import type { User } from "../models/User";
import { changePassword, editUser } from "../services/userApi";

import '../css/user/UserPersonalDetails.css'
import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";

const UserPersonalDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit" | "password") => void }) => {
  const { user, updateUser } = useAuth()
  const {message, setMessage, showAlert, setShowAlert, setIsFailure, isFailure} = useAlertDialog()
  if (!user) return <p>לא בוצעה התחברות</p>
  const [formData, setFormData] = useState<User>({ ...user });
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const handleChangePassword = async() => {
    if (passwords.newPass !== passwords.confirmPass) {
      setMessage("הסיסמאות החדשות אינן תואמות");
      setIsFailure(true);
      setShowAlert(true);
      return;
    }
    try{
      const user = await changePassword(passwords.current, passwords.newPass);
     setMessage("אימות סיסמה בוצע בהצלחה");
      setIsFailure(false);
      setShowAlert(true);

    }catch(error){
      setMessage("אימות סיסמה נכשל");
      setIsFailure(true);
      setShowAlert(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.name || !formData._id) {
      alert("יש למלא את כל השדות");
      return;
    }
    console.log(formData);
    try {
      const user = await editUser(formData);
      updateUser(user);
      setEditMode('view');
    } catch (error) {
      alert((error as any).message)
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value })
  }
  const handlePasswordsChange = (field: string, value: string | number) => {
    setPasswords({ ...passwords, [field]: value })
  }
  const changePasswordSuccess = () => {
    setEditMode("view")
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        {editMode == 'password'? 'שינוי סיסמה' : 'פרטים אישיים'}
      </h2>
      {user ? (
        <>
          {editMode === "view" && (
            <div>
              <p><strong>שם חבר העמותה:</strong> {user.name}</p>
              <p><strong>אימייל:</strong> {user.email}</p>
              <p><strong>טלפון:</strong> {user.phone}</p>
              <p><strong>תפקיד:</strong> {user.role}</p>
              <div className="user-edit-buttons">
                <button
                  onClick={() => setEditMode("edit")}
                  style={{ ...primaryBtnStyle, marginTop: "15px" }}
                >
                  עריכת פרטים
                </button>
                <button
                  onClick={() => setEditMode("password")}
                  style={{ ...primaryBtnStyle, marginTop: "15px" }}
                >
                  שינוי סיסמא
                </button>
              </div>
            </div>
          )}

          {editMode === "edit" && (
            <div>
              <InputText field='name' value={formData.name} placeholder="שם חבר העמותה" onChange={handleChange} />
              <InputText field='email' type="email" value={formData.email || ""} placeholder="אימייל" onChange={handleChange} />
              <InputText field='phone' type="tel" value={formData.phone || ""} placeholder="טלפון" onChange={handleChange} />


              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleSaveChanges} style={primaryBtnStyle}>שמור</button>
                <button onClick={() => setEditMode("view")} style={{ ...primaryBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
              </div>
            </div>
          )}

          {editMode === "password" && (
            <div>
              <InputText field='current' type="password" value={passwords.current} placeholder="סיסמה נוכחית" onChange={handlePasswordsChange} />
              <InputText field='newPass' type="password" value={passwords.newPass || ""} placeholder="סיסמה חדשה" onChange={handlePasswordsChange} />
              <InputText field='confirmPass' type="password" value={passwords.confirmPass || ""} placeholder="אשר סיסמה" onChange={handlePasswordsChange} />

              <AlertDialog show={showAlert} message={message} failureOnClose={() => setShowAlert(false)} isFailure={isFailure} successOnClose={()=>changePasswordSuccess()}/>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleChangePassword} style={primaryBtnStyle}>שינוי סיסמה</button>
                <button onClick={() => setEditMode("view")} style={{ ...primaryBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
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