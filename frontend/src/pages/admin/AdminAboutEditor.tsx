import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAboutEditor() {
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/about`);
        setAbout(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת עמוד עלינו:", err);
      }
    };
    fetchAbout();
  }, []);

  const saveChanges = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/about`, about);
      alert("העמוד עודכן בהצלחה ✅");
    } catch (err) {
      console.error("שגיאה בעדכון עמוד עלינו:", err);
      alert("שגיאה בשמירה ❌");
    }
  };

  if (!about) return <p>טוען תוכן...</p>;

  return (
    <div dir="rtl" className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">עריכת עמוד עלינו</h2>

      <input
        type="text"
        value={about.heroTitle}
        onChange={(e) => setAbout({ ...about, heroTitle: e.target.value })}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        placeholder="כותרת הראשית"
      />

      <textarea
        value={about.heroText}
        onChange={(e) => setAbout({ ...about, heroText: e.target.value })}
        className="border border-gray-300 rounded-lg p-2 w-full h-32 mb-4"
        placeholder="טקסט הראשי"
      />

      <input
        type="text"
        value={about.visionTitle}
        onChange={(e) => setAbout({ ...about, visionTitle: e.target.value })}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        placeholder="כותרת החזון"
      />

      <textarea
        value={about.visionText}
        onChange={(e) => setAbout({ ...about, visionText: e.target.value })}
        className="border border-gray-300 rounded-lg p-2 w-full h-32 mb-4"
        placeholder="טקסט החזון"
      />

      {/* אפשר להוסיף עורך לכל feature */}
      {about.features.map((f: any, i: number) => (
        <div key={i} className="mb-4">
          <input
            type="text"
            value={f.title}
            onChange={(e) => {
              const features = [...about.features];
              features[i].title = e.target.value;
              setAbout({ ...about, features });
            }}
            className="border border-gray-300 rounded-lg p-2 w-full mb-1"
          />
          <textarea
            value={f.text}
            onChange={(e) => {
              const features = [...about.features];
              features[i].text = e.target.value;
              setAbout({ ...about, features });
            }}
            className="border border-gray-300 rounded-lg p-2 w-full h-20"
          />
        </div>
      ))}

      <textarea
        value={about.closingText}
        onChange={(e) => setAbout({ ...about, closingText: e.target.value })}
        className="border border-gray-300 rounded-lg p-2 w-full h-32 mb-4"
        placeholder="טקסט הסיום"
      />

      <button onClick={saveChanges} className="bg-blue-700 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-800">
        שמור שינויים
      </button>
    </div>
  );
}
