import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";
import { PlusCircle, Home, Users, LogOut, FileText, Settings } from "lucide-react";
import NgoDonors from "../components/NgoDonors";
import CampaignItem from "../components/CampaignItem";
import { cardStyle, inputStyle, menuBtnStyle, primaryBtnStyle } from "../css/dashboardStyles";
import NgoPersonalDetails from "../components/NgoPersonalDetails";

const NgoDashboard: React.FC = () => {
  const { ngo } = useAuth();
  const { campaigns, addCampaign } = useCampaigns();

  const [activePage, setActivePage] = useState<
    "dashboard" | "newCampaign" | "campaigns" | "profile" | "donors"
  >("dashboard");
  console.log('campaigns', campaigns);

  const [form, setForm] = useState({
    title: "",
    goal: "",
    startDate: "",
    endDate: "",
    description: "",
    logo: null as File | null,
    image: null as File | null,
    video: null as File | null,
  });

  const handleCreateCampaign = async () => {
    if (!form.title || !form.goal) return alert("יש למלא את כל השדות");
    if (!ngo) return;
    const newCampaign = {
      ngo: ngo._id,
      title: form.title,
      description: form.description,
      targetAmount: Number(form.goal),
      goal: Number(form.goal),
      startDate: form.startDate,
      numOfDonors:0,
      endDate: form.endDate,
      images: form.image ? [form.image] : [],
      ngoLogo: "form.logo",
      video: form.title,
      tags: [],  // אם רוצים, אפשר להוסיף שדות tags מהטופס
    };


    const success = await addCampaign(newCampaign); // ✅ רק זה, בלי createCampaign ישיר = 
    if(!success){
      alert("שגיאה ביצירת הקמפיין");
      return;
    }
    alert("הקמפיין נוצר בהצלחה!");
    setForm({
      title: "",
      goal: "",
      startDate: "",
      endDate: "",
      description: "",
      logo: null,
      image: null,
      video: null,
    });
    setActivePage("campaigns");
  };

  const [editMode, setEditMode] = useState<"view" | "edit" | "password">("view");

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });



  const handleChangePassword = () => {
    if (passwords.newPass !== passwords.confirmPass) {
      alert("אימות סיסמה נכשל");
      return;
    }
    //FIXME 
    // if (passwords.current !== ngo?.password) {
    //   alert("סיסמה נוכחית שגויה");
    //   return;
    // }
    setPasswords({ current: "", newPass: "", confirmPass: "" });
    setEditMode("view");
  };

  return (
    <div dir="rtl" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f7f9fc" }}>
      {/* סרגל צד */}
      <div
        style={{
          width: "240px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
            ניהול עמותה
          </h2>
          <button
            onClick={() => setActivePage("dashboard")}
            style={menuBtnStyle}
          >
            <Home size={20} /> דשבורד
          </button>
          <button
            onClick={() => setActivePage("newCampaign")}
            style={{ ...menuBtnStyle, background: "linear-gradient(90deg,#10b981,#059669)" }}
          >
            <PlusCircle size={20} /> קמפיין חדש
          </button>
          <button onClick={() => setActivePage("campaigns")} style={menuBtnStyle}>
            <FileText size={20} /> הקמפיינים שלי
          </button>
          <button onClick={() => setActivePage("profile")} style={menuBtnStyle}>
            <Settings size={20} /> פרטים אישיים
          </button>
          <button onClick={() => setActivePage("donors")} style={menuBtnStyle}>
            <Users size={20} /> תורמי העמותה
          </button>
        </div>
        <button style={{ ...menuBtnStyle, color: "#f87171" }}>
          <LogOut size={20} /> יציאה
        </button>
      </div>

      {/* תוכן */}
      <div style={{ flex: 1, padding: "30px" }}>
        {activePage === "dashboard" && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#059669" }}>
              ברוך הבא, {ngo?.name}
            </h1>
            <p style={{ fontSize: "18px", marginTop: "10px" }}>זהו האזור האישי שלך.</p>

            {/* סטטיסטיקות */}
            <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
              {statCard("קמפיינים פעילים", campaigns.length)}
              {statCard("סכום כולל", "₪" + campaigns.reduce((a, c) => a + c.raised, 0))}
              {statCard("תורמים", 120)}
            </div>
          </div>
        )}
        {activePage == "donors" && <NgoDonors />}
        {activePage === "newCampaign" && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
              יצירת קמפיין
            </h2>
            <input type="text" placeholder="שם הקמפיין" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="סכום יעד" value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })} style={inputStyle} />
            <label style={{ fontWeight: "bold" }}>תאריך התחלה:</label>
            <input type="date" value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} />
            <label style={{ fontWeight: "bold" }}>תאריך סיום:</label>
            <input type="date" value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inputStyle} />
            <textarea placeholder="תיאור הקמפיין" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, height: "80px" }} />

            <label>לוגו העמותה:</label>
            <input type="file" accept="image/*"
              onChange={(e) => setForm({ ...form, logo: e.target.files ? e.target.files[0] : null })} style={inputStyle} />
            {form.logo && <img src={URL.createObjectURL(form.logo)} alt="לוגו" style={{ width: "50px", height: "50px", borderRadius: "50%", marginBottom: "10px" }} />}

            <label>תמונת קמפיין:</label>
            <input type="file" accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files ? e.target.files[0] : null })} style={inputStyle} />
            {form.image && <img src={URL.createObjectURL(form.image)} alt="תמונה" style={{ width: "100px", height: "70px", borderRadius: "8px", marginBottom: "10px" }} />}

            <label>סרטון:</label>
            <input type="file" accept="video/*"
              onChange={(e) => setForm({ ...form, video: e.target.files ? e.target.files[0] : null })} style={inputStyle} />
            {form.video && <video src={URL.createObjectURL(form.video)} controls style={{ width: "150px", marginBottom: "10px" }} />}

            <button onClick={handleCreateCampaign} style={primaryBtnStyle}>
              צור קמפיין
            </button>
          </div>
        )}

        {activePage === "profile" && <NgoPersonalDetails editMode={editMode} setEditMode={setEditMode}/>}


        {activePage === "campaigns" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
              הקמפיינים שלי
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
              {campaigns.map((c) => <CampaignItem key={c._id} c={c}/>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



const statCard = (title: string, value: string | number) => (
  <div style={cardStyle}>
    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{title}</h3>
    <p style={{ fontSize: "24px", color: "#059669", marginTop: "10px" }}>{value}</p>
  </div>
);

export default NgoDashboard;
