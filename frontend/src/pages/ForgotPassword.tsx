import { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/LoginNgo.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("http://localhost:4000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setMessage("קוד נשלח למייל שלך!");
      setTimeout(() => navigate("/verify-code", { state: { email } }), 1500);
    } else setMessage(data.message);
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <h1 className="login-title">שכחתי סיסמה</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="הכנס אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <button className="login-btn" disabled={loading}>
            {loading ? "שולח..." : "שלח קוד למייל"}
          </button>
          {message && <div className="login-error">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
