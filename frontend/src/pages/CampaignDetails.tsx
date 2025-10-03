import { useParams } from "react-router-dom";
import { useCampaigns } from "../contexts/CampaignsContext";
import { useState, type ChangeEvent } from "react";
import { useAuth } from "../contexts/AuthContext";
import { creditDonation } from "../services/api";

const CampaignDetails: React.FC = () => {
  const { id } = useParams();
  const { campaigns } = useCampaigns();
  const campaign = campaigns.find((c) => c._id! === (id));
  const [showCreditPay, setShowCreditPay] = useState<boolean>(false)

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
          {campaign.raised.toLocaleString()} ₪ מתוך {campaign.goal.toLocaleString()} ₪
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>מספר תורמים: {Math.floor(Math.random() * 500) + 1}</p>
      </div>

      {/* כפתורים */}
      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button style={{ flex: 1, backgroundColor: "green", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}
          onClick={() => setShowCreditPay(true)}>
          תרומה באשראי
        </button>

        <button style={{ flex: 1, backgroundColor: "#4b5563", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}>
          תרומה בקריפטו
        </button>
      </div>
      {showCreditPay && <CreditPayment close={() => setShowCreditPay(false)} campaignId={campaign._id!} userId={campaign.ngo} />}

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

const CreditPayment = ({ close, campaignId, userId }: { close: () => void, campaignId: string, userId: string }) => {
  const date = new Date()
  //const { ngo } = useAuth();
  const [ccForm, setCcform] = useState({donorNumber:'', donorEmail:'', donorFirstName:'', donorLastName:'', amount:0, currency:'', ccNumber: '', expYear: date.getFullYear(), expMonth: 1, cvv: 0, ownerId: '', ownername: '' })
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { id, value } = event.target;
    setCcform({ ...ccForm, [id]: value })
  }

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (ccForm.ccNumber.length < 8) {
      setMessage("cc number is too short")
      return;
    }
    if (ccForm.cvv < 100 || ccForm.cvv > 999) {
      setMessage("cvv is invalid ")
      return
    }
    // send post /charge
    const chargeData = { ...ccForm, campaignId, }
    const {data, status} = await creditDonation(chargeData, campaignId)

    console.log('sent', chargeData)
    console.log(data, status);
    if(status == 201){
      close()
    }else{
      setMessage(data.message)
    }
  }

  return (
    <form onSubmit={handlePayment}>
      <label htmlFor="donorFirstName">שם פרטי</label><input id="donorFirstName" placeholder="שם פרטי" type="text" required onChange={handleChange} />
      <label htmlFor="donorLastName">שם משפחה</label><input id="donorLastName" placeholder="שם משפחה" type="text" required onChange={handleChange} />
      <label htmlFor="donorNumber">פלאפון</label><input id="donorNumber" placeholder="מספר פלאפון" pattern="^[0-9]{3}[\-.]?[0-9]{7}$" title="incorrect be xxx.1234567" type="tel" required onChange={handleChange} />
      <label htmlFor="donorEmail">מייל</label><input id="donorEmail" placeholder="מייל" type="email" required onChange={handleChange} />
      <p>credit payment</p>
      {message && <p>{message}</p>}
      <label htmlFor="amount">סכום </label><input id="amount" placeholder="סכום התרומה" required onChange={handleChange} />
      <label htmlFor="currency">מטבע</label><select id="currency" onChange={handleChange}><option value="ILS">ILS</option><option value="USD">USD</option><option value="EU">EU</option></select>
      <label htmlFor="ccNumber">כרטיס אשראי</label><input id="ccNumber" placeholder="מספר כרטיס" required onChange={handleChange} />
      <label>תאריך תפוגה</label>
      <input id="expYear" type="number" min={date.getFullYear()} max={date.getFullYear() + 15} placeholder="שנה" required onChange={handleChange} />
      <input id="expMonth" type="number" min="1" max="12" placeholder="חודש" required onChange={handleChange} />
      <label htmlFor="cvv">CVV code</label><input id="cvv" placeholder="cvv" required onChange={handleChange} />
      <label htmlFor="ownerId">ת"ז</label><input id="ownerId" type="text" placeholder="תעודת זהות בעל הכרטיס" required onChange={handleChange} />
      <label htmlFor="ownerName">שם</label><input id="ownerName" type="text" placeholder="שם בעל הכרטיס" required onChange={handleChange} />
      <button type='submit' style={{ flex: 1, backgroundColor: "green", color: "white", padding: "10px", borderRadius: "8px", border: "none" }}>
        תרום </button>
    </form>
  )

}
export default CampaignDetails;
