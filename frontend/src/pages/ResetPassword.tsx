import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/LoginNgo.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const { state } = useLocation();
  const email = state?.email;
  const code = state?.code;
  const navigate = useNavigate();

  const handleReset = async (e: any) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("הסיסמה שונתה בהצלחה!");
      setTimeout(() => navigate("/login"), 2000);
    } else setMessage(data.message);
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
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
          />
          <button className="login-btn">שנה סיסמה</button>
          {message && <div className="login-error">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
