import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";
import { PlusCircle, Home, Users, LogOut, FileText, Settings } from "lucide-react";

const NgoDashboard: React.FC = () => {
 const { ngo } = useAuth();
  const { campaigns, addCampaign } = useCampaigns();

  const [activePage, setActivePage] = useState<
    "dashboard" | "newCampaign" | "campaigns" | "profile" | "donors"
  >("dashboard");

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

  const handleCreateCampaign = () => {
    if (!form.title || !form.goal) return alert("יש למלא את כל השדות");

    addCampaign({
      title: form.title,
      goal: Number(form.goal),
_id: crypto.randomUUID(),
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
      ngoLogo: form.logo ? URL.createObjectURL(form.logo) : "/logos/default.png",
      image: form.image ? URL.createObjectURL(form.image) : "/campaigns/default.png",
      video: form.video ? URL.createObjectURL(form.video) : undefined,
    });

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
  const [formData, setFormData] = useState({
    name: ngo?.name || "",
    id: ngo?._id || "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const handleSaveChanges = () => {
    if (!formData.name || !formData.id) {
      alert("יש למלא את כל השדות");
      return;
    }
  };

  const handleChangePassword = () => {
    if (passwords.newPass !== passwords.confirmPass) {
      alert("אימות סיסמה נכשל");
      return;
    }
    if (passwords.current !== ngo?.password) {
      alert("סיסמה נוכחית שגויה");
      return;
    }
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

{activePage === "profile" && (
  <div style={cardStyle}>
    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
      פרטם אישיים
    </h2>
    {ngo ? (
      <>
        {editMode === "view" && (
          <div>
            <p><strong>שם העמותה:</strong> {ngo.name}</p>
            <p><strong>מספר עמותה:</strong> {ngo._id}</p>
            <p><strong>אימייל:</strong> {ngo.email}</p>
            <p><strong>טלפון:</strong> {ngo.phone}</p>
            <button
              onClick={() => setEditMode("edit")}
              style={{ ...primaryBtnStyle, marginTop: "15px" }}
            >
              עריכת פרטים
            </button>
          </div>
        )}

        {editMode === "edit" && (
          <div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="שם העמותה"
              style={inputStyle}
            />
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="מספר עמותה"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={handleSaveChanges} style={primaryBtnStyle}>שמור</button>
              <button onClick={() => setEditMode("view")} style={{ ...menuBtnStyle, background: "#f87171", color: "#fff" }}>ביטול</button>
            </div>
          </div>
        )}
      </>
    ) : (
      <p>לא נמצאו פרטים, אנא התחבר שוב.</p>
    )}
  </div>
)}


        {activePage === "campaigns" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
              הקמפיינים שלי
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
              {campaigns.map((c) => (
                <div key={c._id} style={cardStyle}>
                  <img src={c.image} alt="קמפיין" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>{c.title}</h3>
                  <p>{c.raised.toLocaleString()} ₪ מתוך {c.goal.toLocaleString()} ₪</p>
                  <div style={{ background: "#e5e7eb", borderRadius: "8px", overflow: "hidden", height: "8px", marginTop: "5px" }}>
                    <div style={{ width: `${(c.raised / c.goal) * 100}%`, background: "#10b981", height: "100%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const menuBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 15px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  marginBottom: "10px",
};

const primaryBtnStyle: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(90deg,#10b981,#059669)",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "10px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const statCard = (title: string, value: string | number) => (
  <div style={cardStyle}>
    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{title}</h3>
    <p style={{ fontSize: "24px", color: "#059669", marginTop: "10px" }}>{value}</p>
  </div>
);

export default NgoDashboard;
