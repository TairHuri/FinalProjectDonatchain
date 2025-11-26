import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/LoginNgo.css";

const ResetPassword = () => {
   // Local state for the new password, API response message, and validation errors
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
   // Extracting the reset confirmation data passed via navigation state (email + reset code)
  const { state } = useLocation();
  const email = state?.email;
  const code = state?.code;
  const navigate = useNavigate();

    // Password validation rules using regex and length checks
  // Each rule returns true if it passes
  const passwordRules = {
    length: (pw: string) => pw.length >= 8,
    upper: (pw: string) => /[A-Z]/.test(pw),
    lower: (pw: string) => /[a-z]/.test(pw),
    number: (pw: string) => /\d/.test(pw),
    special: (pw: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
  };

    // Validate password using all rules above
  const isValidPassword = (password: string) => {
    return (
      passwordRules.length(password) &&
      passwordRules.upper(password) &&
      passwordRules.lower(password) &&
      passwordRules.number(password) &&
      passwordRules.special(password)
    );
  };

   // Handle reset password submit
  //  Note: Consider wrapping fetch in try/catch and moving URL to environment variable
  const handleReset = async (e: any) => {
    e.preventDefault();

    if (!isValidPassword(newPassword)) {
      setPasswordError(
        "הסיסמה חייבת לכלול לפחות 8 תווים, אות גדולה, אות קטנה, ספרה ותו מיוחד."
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

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (!value) setPasswordError("");
    else if (!isValidPassword(value))
      setPasswordError("הסיסמה עדיין לא עומדת בכל הדרישות.");
    else setPasswordError("");
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

          <div className="password-hint" style={{ textAlign: "right" }}>
            <ul style={{ fontSize: "0.9rem", color: "#444", listStyle: "none", paddingRight: "10px" }}>
              <li>
                {passwordRules.length(newPassword) ? "✅" : "❌"} לפחות 8 תווים
              </li>
              <li>
                {passwordRules.upper(newPassword) ? "✅" : "❌"} לפחות אות גדולה אחת (A–Z)
              </li>
              <li>
                {passwordRules.lower(newPassword) ? "✅" : "❌"} לפחות אות קטנה אחת (a–z)
              </li>
              <li>
                {passwordRules.number(newPassword) ? "✅" : "❌"} לפחות ספרה אחת (0–9)
              </li>
              <li>
                {passwordRules.special(newPassword) ? "✅" : "❌"} לפחות תו מיוחד אחד (!@#$%^&* וכו׳)
              </li>
            </ul>
          </div>

          {passwordError && (
            <div className="login-error" style={{ color: "red", fontSize: "0.9rem" }}>
              {passwordError}
            </div>
          )}

          <button className="login-btn" type="submit">
            שנה סיסמה
          </button>

          {message && (
            <div
              className="login-success"
              style={{ color: "green", marginTop: "10px", fontWeight: 500 }}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
