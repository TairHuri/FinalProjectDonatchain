import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Building2, FileText, Heart, Settings, Home, LogOut, FilePenLine, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cardStyle, menuBtnStyle } from "../../css/dashboardStyles";
import AdminDonors from "../../components/AdminDonors";
import CampaignList from "../../components/CampaignList";
import AdminAboutEditor from "./AdminAboutEditor";
import RulesViewer from "./RulesViewer";
import AdminRulesEditor from "./AdminRulesEditor";
import AdminNgoList from "../../components/admin/AdminNgoList";
import { useAuth } from "../../contexts/AuthContext"; 
import '../../css/AdminDashboard.css'
import RequestFromUsers from "../../components/admin/RequestFromUsers";


interface Stats {
  usersCount: number;
  ngosCount: number;
  campaignsCount: number;
  donationsCount: number;
  totalRaised: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activePage, setActivePage] = useState<
    "dashboard" | "donors" | "ngos" | "campaigns" | "terms" | "about" | "request"
  >("dashboard");
  const navigate = useNavigate();
  const [selectedNgo, setSelectedNgo] = useState<any | null>(null);
  const { logout } = useAuth(); 


  // useEffect(() => {
  //   fetchStats();
  //   const interval = setInterval(fetchStats, 10000); 
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (activePage === "dashboard") {
      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [activePage]);


  // const fetchStats = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setStats(res.data);
  //   } catch (err) {
  //     console.error("שגיאה בטעינת הנתונים:", err);
  //   }
  // };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const [statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        usersCount: statsRes.data.usersCount,
        ngosCount: statsRes.data.ngosCount,
        campaignsCount: statsRes.data.campaignsCount,
        donationsCount: statsRes.data.donationsCount,
        totalRaised: statsRes.data.totalRaised,
      });

      console.log("✅ הנתונים רועננו בהצלחה!");
    } catch (err) {
      console.error("❌ שגיאה בטעינת הנתונים בדשבורד המנהל:", err);
    }
  };

const handleLogout = () => {
  logout(); // מאפס את ה־context
  localStorage.clear();
  navigate("/login");

};


  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        // minHeight: "100vh",
        height: '100%',
        backgroundColor: "#f7f9fc",
        width: "100%",
      }}
    >
      {/* סרגל צד */}
      <div
        style={{
          width: "18dvw",
          background: "#1f2937",
          color: "white",
          padding: " 15px 10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'calibri',
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            ניהול מערכת
          </h2>

          <button
            onClick={() => setActivePage("dashboard")}
            style={menuBtnStyle}
          >
            <Home size={20} /> דף הבית
          </button>

          <button
            onClick={() => setActivePage("donors")}
            style={menuBtnStyle}
          >
            <Users size={20} /> רשימת תורמים
          </button>

          <button
            onClick={() => setActivePage("ngos")}
            style={menuBtnStyle}
          >
            <Building2 size={20} /> רשימת עמותות
          </button>

          <button
            onClick={() => setActivePage("campaigns")}
            style={menuBtnStyle}
          >
            <FileText size={20} /> רשימת קמפיינים
          </button>

          <button
            onClick={() => setActivePage("terms")}
            style={menuBtnStyle}
          >
            <Heart size={20} /> תקנון האתר
          </button>

          <button
            onClick={() => setActivePage("about")}
            style={menuBtnStyle}
          >
            <Settings size={20} /> עמוד "עלינו"
          </button>
          <button
            onClick={() => setActivePage("request")}
            style={menuBtnStyle}
          >
            <FilePenLine size={20} /> בקשות משתמשים
          </button>
        </div>

        <button
          style={{ ...menuBtnStyle, color: "#f87171", marginBottom: '1px', paddingBottom: '1px' }}
          onClick={handleLogout}
        >
          <LogOut size={20} /> יציאה
        </button>
      </div>

      {/* תוכן */}
      <div className="admin-container">
        {activePage === "dashboard" && (
          <div>
            <h1 style={{ fontFamily: 'calibri', fontSize: "28px", fontWeight: "bold", color: "#059669", }}>
              ברוך הבא, מנהל המערכת
            </h1>
            <p style={{ fontFamily: 'calibri', fontSize: "18px", marginTop: "10px" }}>
              זהו הדשבורד שלך לניהול כל נתוני האתר.
            </p>
            {!stats ? (
              <p style={{ marginTop: "20px" }}>טוען נתונים...</p>
            ) : (
              <div style={{ fontFamily: 'calibri', display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap", textAlign: 'center', }}>
                {statCard("משתמשים", stats?.usersCount ?? 0)}
                {statCard("עמותות", stats?.ngosCount ?? 0)}
                {statCard("קמפיינים", stats?.campaignsCount ?? 0)}
                {statCard("תרומות", stats?.donationsCount ?? 0)}
                {statCard("סה״כ גויס", `${(stats?.totalRaised ?? 0).toLocaleString()} ₪`)}

              </div>
            )}
          </div>
        )}

        {/* ✅ כאן הוספנו את התצוגה החדשה של רשימת התורמים */}
        {activePage === "donors" && <AdminDonors />}
        {activePage === "ngos" && <AdminNgoList />}
        {activePage === "campaigns" && <CampaignList />}
        {activePage === "about" && <AdminAboutEditor />}
        {activePage === "request" && <RequestFromUsers />}
        {activePage === "terms" && (
          <div>
            <h2 style={{ color: "#059669", fontFamily: 'calibri', fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              ניהול תקנון האתר
            </h2>
            {/* view */}
            <RulesViewer />
            {/*edit*/}
            <AdminRulesEditor />
          </div>
        )}
      </div>
    </div>
  );
};

const statCard = (title: string, value: string | number) => (
  <div style={cardStyle}>
    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{title}</h3>
    <p
      style={{
        fontSize: "24px",
        color: "#059669",
        marginTop: "10px",
      }}
    >
      {value}
    </p>
  </div>
);

export default AdminDashboard;
