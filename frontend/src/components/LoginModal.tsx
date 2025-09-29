import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const { login, register } = useAuth();

  // סטייט לטופס התחברות
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // סטייט לטופס הרשמה
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      alert("אנא מלאי אימייל וסיסמה");
      return;
    }
    const success = await login({
      id: loginData.email, // אם ב־API שלך זה נקרא id, השאירי כך
      password: loginData.password,
    });
    if (success) {
      onClose();
    } else {
      alert("פרטי התחברות שגויים");
    }
  };

  const handleRegister = async () => {
    if (
      !registerData.email ||
      !registerData.password ||
      !registerData.firstName
    ) {
      alert("אנא מלאי שם פרטי, אימייל וסיסמה");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      alert("הסיסמאות אינן תואמות");
      return;
    }

    const success = await register({
      name: registerData.firstName + " " + registerData.lastName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
    });
    if (success) {
      alert("נרשמת בהצלחה!");
      setTab("login");
    } else {
      alert("שגיאה בהרשמה");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          minWidth: "350px",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* טאבים */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={() => setTab("login")}
            style={{
              padding: "0.5rem 1rem",
              borderBottom:
                tab === "login" ? "3px solid #556b2f" : "none",
              fontWeight: tab === "login" ? "bold" : "normal",
            }}
          >
            התחברות
          </button>
          <button
            onClick={() => setTab("register")}
            style={{
              padding: "0.5rem 1rem",
              borderBottom:
                tab === "register" ? "3px solid #556b2f" : "none",
              fontWeight: tab === "register" ? "bold" : "normal",
            }}
          >
            הרשמה
          </button>
        </div>

        {/* טופס התחברות */}
        {tab === "login" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <input
              type="email"
              placeholder="כתובת אימייל"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              style={inputStyle}
            />
            <button style={buttonStyle} onClick={handleLogin}>
              התחבר
            </button>
          </div>
        )}

        {/* טופס הרשמה */}
        {tab === "register" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              placeholder="שם פרטי"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  firstName: e.target.value,
                })
              }
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="שם משפחה"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  lastName: e.target.value,
                })
              }
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="כתובת אימייל"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="מספר טלפון"
              value={registerData.phone}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  phone: e.target.value,
                })
              }
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="אימות סיסמה"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
              style={inputStyle}
            />
            <button style={buttonStyle} onClick={handleRegister}>
              צור חשבון
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.6rem",
  borderRadius: "0.5rem",
  border: "1px solid #ccc",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.7rem",
  backgroundColor: "#556b2f",
  color: "white",
  borderRadius: "0.5rem",
  fontWeight: "bold",
  cursor: "pointer",
};
