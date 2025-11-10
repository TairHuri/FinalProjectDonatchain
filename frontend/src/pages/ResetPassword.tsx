import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/LoginNgo.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { state } = useLocation();
  const email = state?.email;
  const code = state?.code;
  const navigate = useNavigate();

  // ✅ פונקציית בדיקת תקינות סיסמה
  const isValidPassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const handleReset = async (e: any) => {
    e.preventDefault();

    // בדיקה לפני שליחה
    if (!isValidPassword(newPassword)) {
      setPasswordError(
        "הסיסמה חייבת להכיל לפחות 8 תווים, כולל אות גדולה, אות קטנה, ספרה ותו מיוחד."
      );
      alert(
        "הסיסמה אינה עומדת בדרישות. יש להשתמש באות גדולה, אות קטנה, ספרה ותו מיוחד (לפחות 8 תווים)."
      );
      return;
    }

    const res = await fetch("http://localhost:4000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("הסיסמה שונתה בהצלחה!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage(data.message || "שגיאה באיפוס הסיסמה");
    }
  };

  // ✅ בדיקה בזמן הקלדה (לצורך פידבק מיידי)
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (!value) {
      setPasswordError("");
    } else if (!isValidPassword(value)) {
      setPasswordError(
        "הסיסמה חייבת לכלול לפחות 8 תווים, אות גדולה, אות קטנה, ספרה ותו מיוחד."
      );
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <h1 className="login-title">איפוס סיסמה</h1>
        <form onSubmit={handleReset} className="login-form">
          <input
            type="password"
            placeholder="סיסמה חדשה"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="input-field"
            required
          />

          {/* ✅ טקסט הסבר מתחת לשדה הסיסמה */}
          <div className="password-hint">
            <ul style={{ fontSize: "0.85rem", color: "#555", textAlign: "right", paddingRight: "20px" }}>
              <li>לפחות 8 תווים</li>
              <li>לפחות אות גדולה אחת (A–Z)</li>
              <li>לפחות אות קטנה אחת (a–z)</li>
              <li>לפחות ספרה אחת (0–9)</li>
              <li>לפחות תו מיוחד אחד (!@#$%^&* וכו׳)</li>
            </ul>
          </div>

          {/* הודעת שגיאה אדומה אם הסיסמה לא תקינה */}
          {passwordError && (
            <div className="login-error" style={{ color: "red", fontSize: "0.9rem" }}>
              {passwordError}
            </div>
          )}

          <button className="login-btn" type="submit">
            שנה סיסמה
          </button>

          {message && (
            <div className="login-success" style={{ color: "green", marginTop: "10px" }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
