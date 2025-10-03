import { useParams } from "react-router-dom";
import { useCampaigns } from "../contexts/CampaignsContext";
import { useState } from "react";

const CampaignDetails: React.FC = () => {
  const { id } = useParams();
  const { campaigns } = useCampaigns();
  const campaign = campaigns.find((c) => c._id! === (id));

  const [activeTab, setActiveTab] = useState<"project" | "ngo" | "donations">("project");

  if (!campaign) return <p>קמפיין לא נמצא</p>;

  const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);

  return (
    <div dir="rtl" style={{ background: "white", padding: "24px", borderRadius: "12px", maxWidth: "900px", margin: "0 auto" }}>
      {/* לוגו ושם קמפיין */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={campaign.ngoLogo} alt="ngo logo" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#333" }}>{campaign.title}</h1>
      </div>

      {/* פס התקדמות */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ width: "100%", background: "#e5e7eb", borderRadius: "10px", height: "14px" }}>
          <div style={{ width: `${percent}%`, height: "14px", background: "#22c55e", borderRadius: "10px" }} />
        </div>
        <p style={{ marginTop: "8px", fontSize: "14px" }}>
          {campaign.raised.toLocaleString()} ₪ מתוך {campaign.targetAmount.toLocaleString()} ₪
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>מספר תורמים: {Math.floor(Math.random() * 500) + 1}</p>
      </div>

      {/* כפתורים */}
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button style={{ flex: 1, backgroundColor: "green", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}>
          תרומה באשראי
        </button>
        <button style={{ flex: 1, backgroundColor: "#4b5563", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}>
          תרומה בקריפטו
        </button>
      </div>

      {/* תמונות וסרטון */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", overflowX: "auto" }}>
        <img src={campaign.image} alt="main" style={{ width: "180px", height: "120px", borderRadius: "8px", objectFit: "cover" }} />
        {campaign.video && (
          <video src={campaign.video} controls style={{ width: "250px", borderRadius: "8px" }} />
        )}
      </div>

      {/* טאבים */}
      <div style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid #ccc" }}>
          <button onClick={() => setActiveTab("project")} style={{ padding: "8px", fontWeight: activeTab === "project" ? "bold" : "normal" }}>
            על הפרויקט
          </button>
          <button onClick={() => setActiveTab("ngo")} style={{ padding: "8px", fontWeight: activeTab === "ngo" ? "bold" : "normal" }}>
            על העמותה
          </button>
          <button onClick={() => setActiveTab("donations")} style={{ padding: "8px", fontWeight: activeTab === "donations" ? "bold" : "normal" }}>
            תרומות אחרונות
          </button>
        </div>

        <div style={{ padding: "16px" }}>
          {activeTab === "project" && <p>{campaign.description}</p>}
          {activeTab === "ngo" && <p>מידע על העמותה (נמשוך בעתיד מפרופיל העמותה).</p>}
          {activeTab === "donations" && <p>רשימת תרומות אחרונות (נבנה טבלה).</p>}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
