import { useParams } from "react-router-dom";
import { useCampaigns } from "../contexts/CampaignsContext";
import { useState } from "react";
import CreditPayment from "../components/CreditPayment";
import Modal from "../components/gui/Modal";
import CryptoPayment from "../components/CryptoPayment";
import SimpleGallery from "../components/SimpleGallery";
import type { Ngo } from "../models/Ngo";

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";

const CampaignDetails: React.FC = () => {
  const { id } = useParams();
  const { campaigns } = useCampaigns();
  const campaign = campaigns.find((c) => c._id! === (id));
  const [showCreditPay, setShowCreditPay] = useState<boolean>(false)
  const [showCryptoPay, setShowCryptoPay] = useState<boolean>(false)
  // TODO load Ngo and set its logo as campaign logo
  
  const [activeTab, setActiveTab] = useState<"project" | "ngo" | "donations">("project");

  if (!campaign) return <p>קמפיין לא נמצא</p>;

  const percent = Math.min((campaign.raised / campaign.goal) * 100, 100);

  return (
    <div dir="rtl" style={{ justifyContent:'center',background: "white", padding: "24px", borderRadius: "12px", margin: "0 auto", width: "80vw" }}>
      {/* לוגו ושם קמפיין */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={`${IMAGE_URL}/${(campaign.ngo as unknown as Ngo).logoUrl}`} alt="ngo logo" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
        <h1 style={{ flex:1, fontSize: '3rem', color: "#000000ff", textAlign: 'center'}}>{campaign.title}</h1>
      </div>

      {/* פס התקדמות */}
      <div style={{ marginTop: "20px" }}>
        <div style={{ width: "100%", background: "#e5e7eb", borderRadius: "10px", height: "14px" }}>
          <div style={{ width: `${percent}%`, height: "14px", background: "#22c55e", borderRadius: "10px" }} />
        </div>
        <p style={{ marginTop: "8px", fontSize: "14px" }}>
          {campaign.raised.toLocaleString()} ₪ מתוך {campaign.goal.toLocaleString()} ₪
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>מספר תורמים: {campaign.numOfDonors}</p>
      </div>

      {/* כפתורים */}
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button style={{ flex: 1, backgroundColor: "green", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}
          onClick={() => setShowCreditPay(true)}>
          תרומה באשראי
        </button>

        <button style={{ flex: 1, backgroundColor: "#4b5563", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}
        onClick={() => setShowCryptoPay(true)}>
          תרומה בקריפטו
        </button>
      </div>
    <Modal show={showCryptoPay} component={<CryptoPayment close={() => setShowCryptoPay(false)} campaignId={campaign._id!} userId={campaign.ngo} />}/>  
    <Modal show={showCreditPay} component={<CreditPayment close={() => setShowCreditPay(false)} campaignId={campaign._id!} userId={campaign.ngo} />}/>
      
      {/* תמונות וסרטון */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", overflowX: "hidden" }}>
        <SimpleGallery
          images={campaign.images}
          imageBaseUrl={IMAGE_URL}   // אם צריך
          movie={campaign.movie}
        /> 
        {/* {
          campaign.images.map(image => <img key={image} src={`${IMAGE_URL}/${image}`} alt="main" style={{ width: "180px", height: "120px", borderRadius: "8px", objectFit: "cover" }} />)
        }
        
        {campaign.movie && (
          <video src={campaign.movie} controls style={{ width: "250px", borderRadius: "8px" }} />
        )} */}
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