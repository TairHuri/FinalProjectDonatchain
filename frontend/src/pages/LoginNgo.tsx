import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../css/LoginNgo.css";

const LoginNgo: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("אנא מלא/י אימייל וסיסמה");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });

      if (res.success) {
        // --- שליפת המשתמש מה-localStorage ---
        const storedUser = localStorage.getItem("userData");
        const user = storedUser ? JSON.parse(storedUser) : null;

        // --- נבדוק אם המשתמש הוא מנהל מערכת ---
        if (user?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/ngo/home");
        }
      } else {
        setError(res.message || "שגיאה בהתחברות, נסי שוב.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("שגיאה בשרת, נסי שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <h1 className="login-title">התחברות</h1>

        {error && <div className="login-error">{error}</div>}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="login-form"
        >
          {/* שדה אימייל */}
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          {/* שדה סיסמה */}
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button
              type="button"
              className="pass-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* כפתור התחברות */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className=""></span> : <LogIn size={20} />}
            {loading ? "מתחבר..." : "התחבר"}
          </button>

          {/* שכחתי סיסמה */}
          <div className="login-footer">
            <Link to="/forgot-password">שכחתי סיסמה</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginNgo;
