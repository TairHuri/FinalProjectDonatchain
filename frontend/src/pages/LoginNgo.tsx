
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { loginUser } from "../services/api";

const LoginNgo: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("אנא מלאי אימייל וסיסמה");
      return;
    }

    try {
      const res = await loginUser({ email, password }); // 👈 שולח לשרת email+password
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/ngo/home");
      } else {
        alert(res.message || "פרטי ההתחברות שגויים");
      }
    } catch (err) {
      alert("שגיאה בהתחברות לשרת");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeIn">
        {/* כותרת */}
        <h1 className="text-3xl font-extrabold text-green-700 text-center mb-6">
          התחברות עמותה
        </h1>

        <div className="flex flex-col gap-5">
          {/* אימייל */}
          <div style={{ position: "relative" }}>
            <Mail
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "green",
                width: "20px",
                height: "20px",
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="כתובת אימייל"
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "9999px",
                padding: "12px 16px 12px 40px",
                fontSize: "16px",
              }}
            />
          </div>

          {/* סיסמה */}
          <div style={{ position: "relative" }}>
            <Lock
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "green",
                width: "20px",
                height: "20px",
              }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              style={{
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "9999px",
                padding: "12px 16px 12px 40px",
                fontSize: "16px",
              }}
            />
          </div>

          {/* כפתור התחברות */}
          <button
            onClick={handleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              background: "linear-gradient(to right, #22c55e, #15803d)",
              color: "#fff",
              padding: "12px",
              borderRadius: "9999px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
            }}
          >
            <LogIn style={{ width: "20px", height: "20px" }} />
            התחבר
          </button>

          {/* שכחתי סיסמה */}
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              שכחתי סיסמה
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginNgo;
