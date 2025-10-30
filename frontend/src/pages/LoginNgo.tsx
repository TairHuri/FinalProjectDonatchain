// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { LogIn, Mail, Lock } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";

// const LoginNgo: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const { login } = useAuth(); 

//   const handleLogin = async () => {
//     if (!email || !password) {
//       alert("אנא מלאי אימייל וסיסמה");
//       return;
//     }

//     const res = await login({ email, password });
//     if (res.success) {
//       //  נבדוק אם המשתמש הוא מנהל מערכת
//       const storedUser = localStorage.getItem("userData");
//       const user = storedUser ? JSON.parse(storedUser) : null;
//       navigate("/ngo/home");
//     } else {
//       alert(res.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
//       <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeIn">
//         <h1 className="text-3xl font-extrabold text-green-700 text-center mb-6">
//           התחברות
//         </h1>

//         <div className="flex flex-col gap-5">
//           <div style={{ position: "relative" }}>
//             <Mail
//               style={{
//                 position: "absolute",
//                 left: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "green",
//                 width: "20px",
//                 height: "20px",
//               }}
//             />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="כתובת אימייל"
//               style={{
//                 width: "100%",
//                 border: "1px solid #ccc",
//                 borderRadius: "9999px",
//                 padding: "12px 16px 12px 40px",
//                 fontSize: "16px",
//               }}
//             />
//           </div>

//           <div style={{ position: "relative" }}>
//             <Lock
//               style={{
//                 position: "absolute",
//                 left: "12px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "green",
//                 width: "20px",
//                 height: "20px",
//               }}
//             />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="סיסמה"
//               style={{
//                 width: "100%",
//                 border: "1px solid #ccc",
//                 borderRadius: "9999px",
//                 padding: "12px 16px 12px 40px",
//                 fontSize: "16px",
//               }}
//             />
//           </div>

//           <button
//             onClick={handleLogin}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px",
//               width: "100%",
//               background: "linear-gradient(to right, #22c55e, #15803d)",
//               color: "#fff",
//               padding: "12px",
//               borderRadius: "9999px",
//               fontSize: "16px",
//               fontWeight: "600",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             <LogIn style={{ width: "20px", height: "20px" }} />
//             התחבר
//           </button>

//           <div className="text-center mt-4">
//             <Link
//               to="/forgot-password"
//               className="text-sm text-blue-600 hover:underline"
//             >
//               שכחתי סיסמה
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginNgo;

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
      setError("אנא מלאי אימייל וסיסמה");
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      if (res.success) navigate("/ngo/home");
      else setError(res.message || "שגיאה בהתחברות, נסי שוב.");
    } catch {
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : <LogIn size={20} />}
            {loading ? "מתחבר..." : "התחבר"}
          </button>

          <div className="login-footer">
            <Link to="/forgot-password">שכחתי סיסמה</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginNgo;

