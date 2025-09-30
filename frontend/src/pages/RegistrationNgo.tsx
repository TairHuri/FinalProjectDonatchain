import { useState } from "react";
import { registerUser } from "../services/api";
import { Building2, Mail, Lock, MapPin, Phone, CreditCard, Wallet } from "lucide-react";

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
    goals: "",
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          הרשמת עמותה
        </h1>
        <p className="text-center text-gray-600 mb-8">
          הצטרפי אלינו והשאירי חותם חיובי בעולם ✨
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* שם עמותה */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">שם העמותה</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Building2 className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="name"
                placeholder="שם העמותה"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* מספר עמותה */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">מספר עמותה</label>
            <input
              className="w-full border rounded-full p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              name="ngoId"
              placeholder="מספר עמותה"
              onChange={handleChange}
            />
          </div>

          {/* אימייל */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">אימייל</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="email"
                type="email"
                placeholder="אימייל"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* סיסמה */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">סיסמה</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="password"
                type="password"
                placeholder="סיסמה"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* כתובת */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">כתובת</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="address"
                placeholder="כתובת"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* טלפון */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">טלפון</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="phone"
                placeholder="טלפון"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* חשבון בנק */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">חשבון בנק</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="bankAccount"
                placeholder="חשבון בנק"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ארנק קריפטו */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">כתובת ארנק קריפטו</label>
            <div className="flex items-center border rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-400">
              <Wallet className="w-5 h-5 text-gray-400 mr-2" />
              <input
                className="w-full outline-none"
                name="wallet"
                placeholder="כתובת ארנק קריפטו"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* מטרות */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">מטרות העמותה</label>
            <textarea
              className="w-full border rounded-full p-3 focus:ring-2 focus:ring-blue-400 outline-none h-24 resize-none"
              name="goals"
              placeholder="ספרי בקצרה על מטרות העמותה"
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
            >
              הירשמי עכשיו
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
