// This component manages the personal details of the currently logged-in user.
// It allows viewing, editing, changing password, and deleting the account.
// It relies on the AuthContext to get the current user and update it after edits.
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { cardStyle, primaryBtnStyle } from "../css/general/dashboardStyles"

import InputText from "./gui/InputText";
import type { User } from "../models/User";
import { changePassword, deleteUserApi, editUser } from "../services/userApi";
import { getUsers } from "../services/userApi";


import '../css/user/UserPersonalDetails.css'
import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";
import { useNavigate } from "react-router-dom";
import ConfirmDialog, { useConfirmDialog } from "./gui/ConfirmDialog";

// Props allow controlling which mode the component is in: view, edit, password change, or delete.
const UserPersonalDetails = ({ editMode, setEditMode }: { editMode: string, setEditMode: (mode: "view" | "edit" | "password" | 'deleteUser') => void }) => {
  const { user, updateUser, logout } = useAuth()
  const nav = useNavigate();

  // Alert dialog for success/failure messages
  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();
  const { openConfirm, closeConfirm, showConfirm } = useConfirmDialog();
  if (!user || !user._id || !user.token) return <p>לא בוצעה התחברות</p>
  const [formData, setFormData] = useState<User>({ ...user });
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const hadAnotherManagers = async () => {

    if (!user) return;

    const users: { items: User[] } = await getUsers(user?.ngoId)
    const count = users.items.reduce((accumulator, user) => accumulator + (user.role == 'manager' ? 1 : 0), 0)

    console.log('count', count);

    return count > 1
  }
  
  // Validate email format
  const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  // Validate Israeli phone number
const isValidIsraeliPhone = (phone: string) => {
  if (!phone) return false;
  const clean = phone.replace(/\D/g, "");
  return /^05\d{8}$/.test(clean);
};

  // Handle password change
  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirmPass) {
      setAlert("הסיסמאות החדשות אינן תואמות", true);
      return;
    }
    try {
      await changePassword(passwords.current, passwords.newPass);
      setAlert("אימות סיסמה בוצע בהצלחה", false);

    } catch (error) {
      setAlert("אימות סיסמה נכשל", true);
    }
  };

    // Handle account deletion
  const handleDeleteAccount = async () => {
    closeConfirm();
    if (!user || !user._id) return;
    setEditMode("deleteUser")
    if (user.role == 'manager') {
      const hasManagers = await hadAnotherManagers();

      if (!hasManagers) {
        // alert
        setAlert("לא ניתן למחוק את החשבון - מנהל יחיד", true)
        setEditMode('view')
        return;
      }
    }
    const result: { success: true } | { success: false, message: string } = await deleteUserApi(user._id);
    if (result.success === true) {
      setAlert("מחיקת החשבון בוצעה בהצלחה, לחץ אישור למעבר למסך הבית", false)
    } else {
      setAlert(result.message || "מחיקת החשבון לא הצליחה - אנא נסה מאוחר יותר", true)
      setEditMode('view')
    }
    // request to server
  }

    // Save changes to personal details
const handleSaveChanges = async () => {
  // Validate name
  if (!formData.name || formData.name.trim().length < 2) {
    setAlert("יש להזין שם מלא תקין", true);
    return;
  }

 // Validate email
  if (!isValidEmail(formData.email || "")) {
    setAlert("האימייל שהוזן אינו תקין", true);
    return;
  }

    // Validate Israeli phone
  if (!isValidIsraeliPhone(formData.phone || "")) {
    setAlert("מספר הטלפון אינו תקין. יש להזין מספר ישראלי בפורמט 05XXXXXXXX", true);
    return;
  }

  try {
    const updated = await editUser(formData);
    updateUser(updated);

    setAlert("הפרטים עודכנו בהצלחה", false);

  } catch (error) {
    setAlert("עדכון הפרטים נכשל. נסי שוב מאוחר יותר", true);
  }
};

// Handle closing alert dialog
  const handleAlertSuccess = () => {
    if (editMode == 'deleteUser') {
      logout();
      nav('/');
    } else {
      clearAlert()
      setEditMode("view")
    }
  }
  const handleChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value })
  }
  const handlePasswordsChange = (field: string, value: string | number) => {
    setPasswords({ ...passwords, [field]: value })
  }


  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        {editMode == 'password' ? 'שינוי סיסמה' : 'פרטים אישיים'}
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
                <button
                  onClick={openConfirm}
                  style={{ ...primaryBtnStyle, marginTop: "15px", background: "#f87171" }}
                >
                  מחיקת חשבון
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
      <AlertDialog show={showAlert} message={message} failureOnClose={clearAlert} isFailure={isFailure} successOnClose={handleAlertSuccess} />
      <ConfirmDialog show={showConfirm} message='אתה בטוח שברצונך למחוק חשבון זה?' onYes={handleDeleteAccount} onNo={closeConfirm} />
    </div>
  )

}


export default UserPersonalDetails;