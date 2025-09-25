import { useState } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import { createCampaign } from "../services/api";

const NewCampaign: React.FC = () => {
  const { addCampaign } = useCampaigns();

  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

const [video, setVideo] = useState<string | undefined>(undefined);
const [ngoLogo, setNgoLogo] = useState<string | undefined>(undefined);
const [image, setImage] = useState<string | undefined>(undefined);

  // המרה של קובץ ל-URL מקומי (base64 / blob)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
const newCampaign = {
  title,
  description,
  targetAmount: Number(goal),
  goal: Number(goal),
  startDate,
  endDate,
  images: image ? [image] : [],
  ngoLogo: ngoLogo || "/default-logo.png",
  video,
  tags: [],  // אם רוצים, אפשר להוסיף שדות tags מהטופס
};


    await addCampaign(newCampaign); // ✅ רק זה, בלי createCampaign ישיר
    alert("הקמפיין נוצר בהצלחה!");

    // איפוס שדות
    setTitle("");
    setGoal("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setImage("");
    setNgoLogo("");
    setVideo("");

  } catch (err) {
    console.error("שגיאה ביצירת קמפיין:", err);
    alert("שגיאה ביצירת הקמפיין");
  }
};

  return (
    <div style={{ display: "flex", direction: "rtl" }}>
      <div style={{ flex: 1, padding: "24px", maxWidth: "700px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "green", marginBottom: "20px" }}>
          יצירת קמפיין
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="שם הקמפיין"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}
            required
          />
          <input
            type="number"
            placeholder="סכום יעד"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}
            required
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px" }}
            required
          />
          <textarea
            placeholder="תיאור הקמפיין"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "6px", minHeight: "120px" }}
            required
          />

          {/* העלאת תמונה */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              העלה תמונת קמפיין
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, (val) => setImage(val))}
            />
            {image && (
              <img
                src={image}
                alt="preview"
                style={{ marginTop: "10px", width: "160px", height: "110px", objectFit: "cover", borderRadius: "8px" }}
              />
            )}
          </div>

          {/* העלאת סרטון */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              העלה סרטון קמפיין
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, (val) => setVideo(val))}
            />
            {video && (
              <video
                src={video}
                controls
                style={{ marginTop: "10px", width: "250px", borderRadius: "8px" }}
              />
            )}
          </div>

          {/* העלאת לוגו */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "500" }}>
              העלה לוגו עמותה
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, (val) => setNgoLogo(val))}
            />
            {ngoLogo && (
              <img
                src={ngoLogo}
                alt="logo preview"
                style={{ marginTop: "10px", width: "80px", height: "80px", objectFit: "contain", borderRadius: "50%" }}
              />
            )}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            צור קמפיין
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCampaign;
