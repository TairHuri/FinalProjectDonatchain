import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";
import { PlusCircle, Home, Users, LogOut, FileText, Settings } from "lucide-react";
import NgoDonors from "../components/NgoDonors";
import CampaignItem from "../components/CampaignItem";
import { cardStyle, inputStyle, menuBtnStyle, primaryBtnStyle } from "../css/dashboardStyles";

import NgoUsers from "../components/NgoUsers";
import UserPersonalDetails from "../components/UserPersonalDetails";
import CreateCampaign from "../components/CreateCampaign";
import NgoDetails from "../components/NgoDetails";
import { getDonationsByNgo } from "../services/api";
import { useNavigate } from "react-router-dom";
import EditCampaign from "../components/EditCampaign";



const NgoDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { campaigns } = useCampaigns();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<
    "dashboard" | "newCampaign" | "campaigns" |"editCampaign"| "profile" | "donors" | "ngoUsers" | "ngoDetails"
  >("dashboard");
  const [campaignId, setCampaignId] = useState<string|null>(null)
  console.log('campaigns', campaigns);

  //const showCampaigns = useCallback(() => setActivePage("campaigns"), [])

  const [editMode, setEditMode] = useState<"view" | "edit" | "password">("view");

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const [donationsCount, setDonationsCount] = useState<number>(0)

  useEffect(() => {
    getDonationsCount();
  }, [])

  const getDonationsCount = async () => {
    if (!user) return;
    const donations = await getDonationsByNgo(user.ngoId);
    setDonationsCount(donations.length);
  }

  const editCampaign = (id:string) => {
setActivePage("editCampaign");
setCampaignId(id);
  }
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
    <div dir="rtl" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f7f9fc", width: '80vw' }}>
      {/* סרגל צד */}
      <div
        style={{
          width: "20vw",
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
          <button onClick={() => setActivePage("ngoDetails")} style={menuBtnStyle}>
            <Users size={20} /> פרטי העמותה
          </button>
          <button onClick={() => setActivePage("ngoUsers")} style={menuBtnStyle}>
            <Users size={20} /> חברי העמותה
          </button>
          <button onClick={() => setActivePage("donors")} style={menuBtnStyle}>
            <Users size={20} /> תורמי העמותה
          </button>
        </div>
        <button style={{ ...menuBtnStyle, color: "#f87171" }} onClick={() => {logout();navigate("/");}}>
          <LogOut size={20} /> יציאה
        </button>
      </div>

      {/* תוכן */}
      <div style={{ flex: 1, padding: "30px" }}>
        {activePage === "ngoDetails" && <NgoDetails editMode={editMode} setEditMode={setEditMode} />}
        {activePage === "ngoUsers" && <NgoUsers />}
        {activePage === "dashboard" && (
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#059669" }}>
              ברוך הבא, {user?.name}
            </h1>
            <p style={{ fontSize: "18px", marginTop: "10px" }}>זהו האזור האישי שלך.</p>

            {/* סטטיסטיקות */}
            <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
              {statCard("קמפיינים פעילים", campaigns.length)}
              {statCard("סכום כולל", "₪" + campaigns.reduce((a, c) => a + c.raised, 0))}
              {statCard("תורמים", donationsCount)}
            </div>
          </div>
        )}
        {activePage == "donors" && <NgoDonors />}
        {activePage === "newCampaign" && (<CreateCampaign postSave={() => setActivePage("campaigns")} />)}
        {activePage === "profile" && <UserPersonalDetails editMode={editMode} setEditMode={setEditMode} />}

        {activePage === "campaigns" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
              הקמפיינים שלי
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "20px" }}>
              {campaigns.map((c) => (
                <div key={c._id}>
                  <CampaignItem c={c} showButtons={true} edit={editCampaign}/>
                 
                </div>
              ))}
            </div>
          </div>
        )}
        {activePage == "editCampaign" && <EditCampaign campaignId={campaignId!} editMode={editMode} setEditMode={setEditMode} /> }
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
