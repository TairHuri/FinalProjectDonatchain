import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { Users, Building2, FileText, Heart, Settings, Home, LogOut, FilePenLine, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cardStyle, menuBtnStyle } from "../../css/general/dashboardStyles";
import AdminDonors from "../../components/admin/AdminDonors";
import CampaignList from "../../components/campaign/CampaignList";

import RulesViewer from "./RulesViewer";
import AdminRulesEditor from "./AdminRulesEditor";
import AdminNgoList from "../../components/admin/AdminNgoList";
import { useAuth } from "../../contexts/AuthContext"; 
import AdminAbout from "../../components/admin/AdminAbout";
import RequestFromUsers from "../../components/admin/RequestFromUsers";
import '../../css/admin/AdminDashboard.css'

// Interface for dashboard statistics
interface Stats {
  usersCount: number;
  ngosCount: number;
  campaignsCount: number;
  donationsCount: number;
  totalRaised: number;
}

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  // Holds system statistics for the dashboard cards
  const [stats, setStats] = useState<Stats | null>(null);
 // Controls which page is displayed in the dashboard
  const [activePage, setActivePage] = useState<
    "dashboard" | "donors" | "ngos" | "campaigns" | "terms" | "about" | "request"
  >("dashboard");
  const navigate = useNavigate();

 // Authentication context (logout only is used here)
  const { logout } = useAuth(); 

  // Fetch stats immediately when entering dashboard view
  useEffect(() => {
    if (activePage === "dashboard") {
      fetchStats();
      const interval = setInterval(fetchStats, 10000);
      return () => clearInterval(interval);
    }
  }, [activePage]);

  // Fetch dashboard statistics from backend
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const [statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Update state with API response
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

  // Handle admin logout action
  const handleLogout = () => {
    logout(); // Clear auth context
    localStorage.clear(); // Clear local storage
    navigate("/login"); // Redirect to login page
  };


  return (
    <div dir="rtl" className="admin-first-div">
 {/* Sidebar navigation */}
      <div className="admin-sidebar-navigation">
        <div>
          <h2 className="admin-sidebar-navigation-title">
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
            <Settings size={20} />מי אנחנו
          </button>
          <button
            onClick={() => setActivePage("request")}
            style={menuBtnStyle}
          >
            <FilePenLine size={20} /> בקשות משתמשים
          </button>
        </div>

        <button className="admin-sidebar-navigation-exit" onClick={handleLogout}
        >
          <LogOut size={20} /> יציאה
        </button>
      </div>

    {/* Main content area */}
      <div className="admin-container">
        {activePage === "dashboard" && (
          <div style={cardStyle}>
            <h1 className="home-page-title">
              ברוך הבא, מנהל המערכת
            </h1>
            <p className="home-page-sub-title">
              זהו הדשבורד שלך לניהול כל נתוני האתר.
            </p>
            {!stats ? (
              <p className="home-page-load-data">טוען נתונים...</p>
            ) : (
              <div className="home-page-cards-details">
                {statCard("משתמשים", stats?.usersCount ?? 0)}
                {statCard("עמותות", stats?.ngosCount ?? 0)}
                {statCard("קמפיינים", stats?.campaignsCount ?? 0)}
                {statCard("תרומות", stats?.donationsCount ?? 0)}
                {statCard("סה״כ גויס", `${(stats?.totalRaised ?? 0).toLocaleString()} ₪`)}

              </div>
            )}
          </div>
        )}
        {activePage === "donors" && <CardWrapper><AdminDonors /></CardWrapper>}
        {activePage === "ngos" && <CardWrapper><AdminNgoList /></CardWrapper>}
        {activePage === "campaigns" && <CardWrapper><CampaignList /></CardWrapper>}
        {activePage === "about" &&  <CardWrapper><AdminAbout /></CardWrapper>}
        {activePage === "request" &&  <CardWrapper><RequestFromUsers /></CardWrapper>}
        {activePage === "terms" && (
           <CardWrapper>
            <h2 style={{ color: "#059669", fontFamily: 'calibri', fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>
              ניהול תקנון האתר
            </h2>
            {/* view */}
            <RulesViewer />
            {/*edit*/}
            <AdminRulesEditor />
           </CardWrapper>
        )}
      </div>
    </div>
  );
};

const CardWrapper = ({children}:{children:ReactNode}) => {
  return(
    <div className="admin-card">
      {children}
    </div>
  )
}
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
