import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginNgo: React.FC = () => {
  const [email, setEmail] = useState("");      // <-- הוספנו אימייל
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("אנא מלאי אימייל וסיסמה");
      return;
    }
    const success = await login({ email, password });  // שולח אימייל
    if (success) {
      navigate("/ngo/home");
    } else {
      alert("פרטי ההתחברות שגויים או שהעמותה לא רשומה");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 mt-8 w-full max-w-md flex flex-col gap-4">
        <input
          type="email"
          placeholder="כתובת אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-full px-4 py-2"
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-full px-4 py-2"
        />
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-6 py-2 rounded-xl"
        >
          התחבר
        </button>
      </div>
    </div>
  );
};

export default LoginNgo;
