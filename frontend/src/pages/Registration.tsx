import { useState } from "react";
import { registerUser } from "../services/api";

export default function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    ngoId: "",
    email: "",
    address: "",
    phone: "",
    bankAccount: "",
    wallet: "",
    password: "",
    goals: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📤 שולח נתונים:", formData);
      const res = await registerUser(formData);
      console.log("📥 תגובת שרת:", res);

      if (res.success) {
        alert("נרשמת בהצלחה!");
      } else {
        alert(res.message || "שגיאה בהרשמה");
      }
    } catch (err: any) {
      console.error("❌ שגיאה בבקשה:", err);
      alert("שגיאת שרת: " + err.message);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white flex flex-col">
      <div className="flex justify-between items-center p-6 bg-[#f9f6f2] shadow-sm">
        <h1 className="text-3xl font-bold text-[#6B8E23]">הרשמה</h1>
        <img src="/logo.png" alt="לוגו" className="h-16 w-auto" />
      </div>

      <div className="flex justify-center items-start flex-1 p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl"
        >
          {/* שדות טופס */}
          <input name="name" onChange={handleChange} value={formData.name} placeholder="שם העמותה" className="border rounded-full px-4 py-2" />
          <input name="ngoId" onChange={handleChange} value={formData.ngoId} placeholder="מס' עמותה" className="border rounded-full px-4 py-2" />
          <input name="email" onChange={handleChange} value={formData.email} type="email" placeholder="מייל" className="border rounded-full px-4 py-2" />
          <input name="address" onChange={handleChange} value={formData.address} placeholder="כתובת" className="border rounded-full px-4 py-2" />
          <input name="phone" onChange={handleChange} value={formData.phone} type="tel" placeholder="מס' טלפון" className="border rounded-full px-4 py-2" />
          <input name="bankAccount" onChange={handleChange} value={formData.bankAccount} placeholder="פרטי חשבון בנק" className="border rounded-full px-4 py-2" />
          <input name="wallet" onChange={handleChange} value={formData.wallet} placeholder="כתובת ארנק קריפטו" className="border rounded-full px-4 py-2" />
          <input name="password" onChange={handleChange} value={formData.password} type="password" placeholder="סיסמה" className="border rounded-full px-4 py-2" />

          <textarea
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="מטרות העמותה"
            className="border rounded-2xl px-4 py-2 col-span-2 h-32 resize-none"
          />

          <label className="flex items-center gap-2 col-span-2">
            <input type="checkbox" className="w-4 h-4" required />
            <span>
              אישור <a href="/about/rules" className="underline">תקנון</a>
            </span>
          </label>

          <button type="submit" className="border rounded-full px-4 py-2 bg-[#6B8E23] text-white font-bold hover:bg-[#556B2F] transition col-span-2">
            הירשם
          </button>
        </form>
      </div>
    </div>
  );
}
