import { useState } from "react";
import { registerUser } from "../services/api";

export default function RegistrationNgo() {
  const [formData, setFormData] = useState({
    name: "",
    ngoId: "",
    email: "",
    address: "",
    phone: "",
    bankAccount: "",
    wallet: "",
    password: "",
    goals: "",   // ✅ נוסיף גם את המטרה/תיאור
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      alert("אנא מלאי שם, אימייל וסיסמה");
      return;
    }

    try {
      const res = await registerUser(formData);
      if (res.success) {
        alert("עמותה נרשמה בהצלחה!");
      } else {
        alert(res.message || "שגיאה בהרשמה");
      }
    } catch (err) {
      alert("שגיאת שרת");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="שם העמותה" onChange={handleChange} />
      <input name="ngoId" placeholder="מספר עמותה" onChange={handleChange} />
      <input name="email" placeholder="אימייל" onChange={handleChange} />
      <input name="password" type="password" placeholder="סיסמה" onChange={handleChange} />
      <input name="address" placeholder="כתובת" onChange={handleChange} />
      <input name="phone" placeholder="טלפון" onChange={handleChange} />
      <input name="bankAccount" placeholder="חשבון בנק" onChange={handleChange} />
      <input name="wallet" placeholder="כתובת ארנק קריפטו" onChange={handleChange} />
      <textarea name="goals" placeholder="מטרות העמותה" onChange={handleChange} />
      <button type="submit">ירשם</button>
    </form>
  );
}
