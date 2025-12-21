import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCampaigns } from "../contexts/CampaignsContext";
import { PlusCircle, Home, Users, LogOut, FileText, Settings, FilePenLine } from "lucide-react";
import NgoDonors from "../components/ngo/NgoDonors";
import CampaignItem from "../components/campaign/CampaignItem";

import NgoUsers from "../components/ngo/NgoUsers";
import UserPersonalDetails from "../components/UserPersonalDetails";
import CreateCampaign from "../components/campaign/CreateCampaign";
import NgoDetails from "../components/ngo/NgoDetails";
import { getDonationsByNgo } from "../services/donationApi";
import { useNavigate } from "react-router-dom";
import CampaignDetails from "../components/campaign/CampaignDetails";
import TabsButtons, { useTabsButtons } from "../components/gui/TabsButtons";

import type { Campaign } from "../models/Campaign";
import AdminRequest from "../components/ngo/AdminRequest";

import { cardStyle, menuBtnStyle } from "../css/general/dashboardStyles";
import '../css/ngo/NgoDashboard.css'

/**
 * Tabs for filtering different campaign states.
 */
const tabs = [{ id: 0, label: "כל הקמפיינים" }, { id: 1, label: "קמפיינים פעילים" }, { id: 2, label: "קמפיינים מתוכננים" }, { id: 3, label: "קמפיינים לא פעילים" }, { id: 4, label: "קמפיינים מושהים/מחוקים" }]

const NgoDashboard: React.FC = () => {
  // Authentication
  const { user, logout } = useAuth();
  // Fetching all campaign data from context
  const { campaigns } = useCampaigns();
  const navigate = useNavigate();
  /**
 * Controls which page is currently active inside the dashboard.
 */
  const [activePage, setActivePage] = useState<
    "dashboard" | "newCampaign" | "campaigns" | "CampaignDetails" | "profile" | "donors" | "ngoUsers" | "ngoDetails" | "adminRequest"
  >("dashboard");
  const [campaignId, setCampaignId] = useState<string | null>(null)
  console.log('campaigns', campaigns);
  const { active, setActive } = useTabsButtons()
  /**
  * Campaign filters by type/status (active, planned, expired, inactive, deleted).
  */
  const now = new Date()
  const campaignFilters: { [n: number]: (campaign: Campaign) => boolean } = {
    0: () => true,
    1: (campaign: Campaign) => campaign.startDate.toString().localeCompare(now.toISOString()) <= 0 && campaign.endDate.toString().localeCompare(now.toISOString()) >= 0 && campaign.isActive == true,
    2: (campaign: Campaign) => campaign.startDate.toString().localeCompare(now.toISOString()) >= 0,
    3: (campaign: Campaign) => campaign.endDate.toString().localeCompare(now.toISOString()) <= 0,
    4: (campaign: Campaign) => campaign.isActive == false,

  }
  //const showCampaigns = useCallback(() => setActivePage("campaigns"), [])

  const [editMode, setEditMode] = useState<"view" | "edit" | "password" | 'deleteUser'>("view");


  const [donationsCount, setDonationsCount] = useState<number>(0)

  useEffect(() => {
    if (user != null) getDonationsCount();
  }, [user])

  useEffect(() => {
    setEditMode('view')
  }, [activePage])
  const getDonationsCount = async () => {
    if (!user || !user.ngoId) return;
    const donations = await getDonationsByNgo(user.ngoId);

    setDonationsCount(donations.length);
  };


  const editCampaign = (id: string) => {
    setActivePage("CampaignDetails");
    setCampaignId(id);
  }


  if (!user || !user.ngoId) return;
  return (
    <div dir="rtl" className="first-div-ngo-dashboard">
      <div className="second-div-ngo-dashboard">
        <div>
          <h2 className="title-ngo-dashboard">
            ניהול עמותה
          </h2>

          <button onClick={() => setActivePage("dashboard")} style={menuBtnStyle}>
            <Home size={20} /> דף הבית
          </button>
          <button
            onClick={() => setActivePage("newCampaign")}
            style={{ ...menuBtnStyle, background: "linear-gradient(90deg,#10b981,#059669)", padding: "12px 12px 12px 12px" }}
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

          {user!.role === "manager" && (
            <button onClick={() => setActivePage("adminRequest")} style={menuBtnStyle}>
              <FilePenLine size={20} /> בקשות מהמערכת
            </button>
          )}
        </div>
        <button
          style={{ ...menuBtnStyle, color: "#f87171" }}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut size={20} /> יציאה
        </button>
      </div>


      <div className={`ngo-dashboard-container`} style={{ flex: 1, padding: "10px", alignItems: 'start' }}>
        {activePage === "ngoDetails" && <NgoDetails editMode={editMode} setEditMode={setEditMode} />}
        {activePage === "ngoUsers" && <div style={cardStyle}><NgoUsers /></div>}
        {activePage === "dashboard" && (
          <div style={{ ...cardStyle }}>
            <h1 className="title_home_page-ngo-dashboard">
              ברוך הבא, {user?.name}
            </h1>
            <p className="sub_title_home_page-ngo-dashboard">
              זהו האזור האישי שלך.
            </p>


            <div className="details_home_page-ngo-dashboard">
              {statCard("קמפיינים פעילים", campaigns.filter(campaignFilters[1]).length)}
              {statCard("סכום כולל", "₪" + campaigns.reduce((a, c) => a + c.totalRaised!, 0).toFixed(2))}
              {statCard("תרומות", donationsCount)}
            </div>
          </div>
        )}
        {activePage == "adminRequest" && <div style={cardStyle}><AdminRequest /></div>}
        {activePage == "donors" && <div style={cardStyle}><NgoDonors /></div>}
        {activePage === "newCampaign" && <CreateCampaign postSave={() => setActivePage("campaigns")} />}
        {activePage === "profile" && <UserPersonalDetails editMode={editMode} setEditMode={setEditMode} />}

        {activePage === "campaigns" && (
          <div className="ngo-campaigns-container" style={cardStyle}>
            <h2 className="my_campaigns_title-ngo-dashboard">הקמפיינים שלי</h2>
            <div className="my_campaigns_tabs-ngo-dashboard">
              <TabsButtons active={active} setActive={setActive} tabs={tabs} />
            </div>
            <div className=".my_campaigns_view-ngo-dashboard">
              {campaigns.filter(campaignFilters[active]).map((c) => (
                <div key={c._id}>
                  <CampaignItem c={c} showButtons={true} edit={editCampaign} />
                </div>
              ))}
            </div>
          </div>
        )}
        {activePage == "CampaignDetails" && (
          <CampaignDetails campaignId={campaignId!} editMode={editMode} setEditMode={setEditMode} />
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
