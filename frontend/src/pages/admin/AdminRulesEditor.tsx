import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRulesEditor() {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rules`);
        setRules(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת התקנון:", err);
      }
    };
    fetchRules();
  }, []);

  const saveChanges = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/rules`, rules);
      alert("התקנון עודכן בהצלחה ✅");
    } catch (err) {
      console.error("שגיאה בעדכון התקנון:", err);
      alert("שגיאה בשמירה ❌");
    }
  };

  if (!rules.length) return <p>טוען תקנון...</p>;

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">עריכת תקנון האתר</h2>
      {rules.map((rule, i) => (
        <div key={i} className="mb-4">
          <input
            type="text"
            value={rule.title}
            onChange={(e) => {
              const newRules = [...rules];
              newRules[i].title = e.target.value;
              setRules(newRules);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full mb-1"
          />
          <textarea
            value={rule.text}
            onChange={(e) => {
              const newRules = [...rules];
              newRules[i].text = e.target.value;
              setRules(newRules);
            }}
            className="border border-gray-300 rounded-lg p-2 w-full h-24"
          />
        </div>
      ))}
      <button onClick={saveChanges} className="bg-blue-700 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-800">
        שמור שינויים
      </button>
    </div>
  );
}
