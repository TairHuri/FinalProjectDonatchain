import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import axios from "axios";
import AlertDialog, { useAlertDialog } from "./gui/AlertDialog";

export default function AdminAbout() {
  const [about, setAbout] = useState<any>(null);
    const { showAlert, message,isFailure, clearAlert, setAlert } = useAlertDialog();
  const [aboutData, setAboutData] = useState({
    heroTitle: "",
    heroText: "",
    visionTitle: "",
    visionText: "",
    subtitle: "",
    vision: "",
    features: [] as { title: string; text: string }[],
    closingText: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/about`);
      setAboutData(res.data);
    } catch (err) {
      console.error("שגיאה בטעינת נתוני עמוד עלינו:", err);
    } finally {
      setLoading(false);
    }
  };



  const handleChange = (field: string, value: string) => {
    setAboutData({ ...aboutData, [field]: value });
  };

  const handleFeatureChange = (
    index: number,
    field: "title" | "text",
    value: string
  ) => {
    const newFeatures = [...aboutData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setAboutData({ ...aboutData, features: newFeatures });
  };


  const addFeature = () => {
    setAboutData({
      ...aboutData,
      features: [...aboutData.features, { title: "", text: "" }],
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/about`, aboutData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert("עמוד 'עלינו' עודכן בהצלחה!", false);
    } catch (err) {
      console.error("שגיאה בשמירת הנתונים:", err);
      setAlert("שגיאה בשמירה, נסי שוב.", true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>טוען נתונים...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", textAlign: "right" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
        עריכת עמוד "עלינו"
      </h2>

      <label>כותרת ראשית:</label>
      <input
        type="text"
        value={aboutData.heroTitle}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          handleChange("heroTitle", e.target.value)
        }
        style={inputStyle}
      />

      <label>תיאור קצר (מתחת לכותרת):</label>
      <textarea
        value={aboutData.heroText}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          handleChange("heroText", e.target.value)
        }
        style={textareaStyle}
      />

      <label>חזון:</label>
      <textarea
        value={aboutData.visionTitle}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          handleChange("visionTitle", e.target.value)
        }
        style={textareaStyle}
      />
      <label>טקסט החזון:</label>
      <textarea
        value={aboutData.visionText}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          handleChange("visionText", e.target.value)
        }
        style={textareaStyle}
      />

      <h3 style={{ marginTop: "20px", fontSize: "18px" }}>מאפיינים:</h3>
      {aboutData.features.map((feature, i) => (
        <div key={i} style={featureBoxStyle}>
          <input
            type="text"
            placeholder="כותרת"
            value={feature.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleFeatureChange(i, "title", e.target.value)
            }
            style={inputStyle}
          />
          <textarea
            placeholder="תיאור"
            value={feature.text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleFeatureChange(i, "text", e.target.value)
            }
            style={textareaStyle}
          />
        </div>
      ))}

      <button onClick={addFeature} style={addBtnStyle}>
        ➕ הוספת מאפיין חדש
      </button>
      <br/>
      <label style={{ marginTop: "20px" }}>הודעת סיום:</label>
      <textarea
        value={aboutData.closingText}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          handleChange("closingText", e.target.value)
        }
        style={textareaStyle}
      />

      <button onClick={saveChanges} disabled={saving} style={saveBtnStyle}>
        {saving ? "שומר..." : "שמור שינויים"}
      </button>
      <AlertDialog show={showAlert} message={message} failureOnClose={clearAlert} successOnClose={clearAlert} isFailure={isFailure} />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const textareaStyle = {
  ...inputStyle,
  height: "80px",
};

const featureBoxStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  background: "#f9f9f9",
};

const addBtnStyle = {
  background: "#e5e7eb",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginBottom: "15px",
};

const saveBtnStyle = {
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};
