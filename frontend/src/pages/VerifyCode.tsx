import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/LoginNgo.css";

const VerifyCode = () => {
  //  Local state to store the entered verification code and potential error message
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Router hooks to navigate and receive data passed from previous page
  const navigate = useNavigate();
  const { state } = useLocation();

  //  Retrieve email sent from the "Forgot Password" page
  const email = state?.email;

  //  Handle verification process when user submits the code
  const handleVerify = async (e: any) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (data.success) {
      navigate("/reset-password", { state: { email, code } });
    } else setError(data.message);
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <h1 className="login-title">אימות קוד</h1>
        <form onSubmit={handleVerify} className="login-form">
          <input
            type="text"
            placeholder="הכנס קוד בן 6 ספרות"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input-field"
          />
          <button className="login-btn">אמת קוד</button>
          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;
