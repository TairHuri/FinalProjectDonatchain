// App.tsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import About from "./pages/About";
import LoginNgo from "./pages/LoginNgo";
import DonorsNgo from "./pages/DonorsNgo";
import RegistrationNgo from "./pages/RegistrationNgo";
import NgoDashboard from "./pages/NgoDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { CampaignsProvider } from "./contexts/CampaignsContext";
import Discover from "./pages/Discover";
import Donate from "./pages/Donate";
import CampaignDetails from "./pages/CampaignDetails";
import NewCampaign from "./pages/NewCampaign";
import AboutRules from "./pages/AboutRules";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

import "./App.css";
import Ngos from "./pages/Ngos";
import NgoPageForUsers from "./components/NgoPageForUsers";

// ✅ הוספת דפי שחזור סיסמה
import ForgotPassword from "./pages/ForgotPassword";
import VerifyCode from "./pages/VerifyCode";
import ResetPassword from "./pages/ResetPassword";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CampaignsProvider>
        <div
          className=" h-screen bg-gray-100 text-gray-900 flex flex-col"
        >
          {/* סרגל ניווט עליון */}
          <Navbar />

          {/* תוכן ראשי */}
          <div className=" max-w-6xl px-4
            min-h-[calc(100dvh-70px)]
            max-h-[calc(100dvh-70px)]
            grid place-items-center"
            >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/about" element={<About />} />
              <Route path="/login/ngo" element={<LoginNgo />} />
              <Route path="/registration/ngo" element={<RegistrationNgo />} />
              <Route path="/donors/ngo" element={<DonorsNgo />} />
              <Route path="/ngo/home" element={<NgoDashboard />} />
              <Route path="/campaign/:id" element={<CampaignDetails />} />
              <Route path="/about/rules" element={<AboutRules />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/new" element={<NewCampaign />} />
              <Route path="/campaigns/:ngoId" element={<Campaigns />} />
              <Route path="/ngos" element={<Ngos />} />
              <Route path="/ngos/:id" element={<NgoPageForUsers />} />

              {/*  דפי שחזור סיסמה */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-code" element={<VerifyCode />} />
              <Route path="/reset-password" element={<ResetPassword />} />
<Route path="/login" element={<LoginNgo />} />
              {/*  נתיב מוגן — רק מנהל מורשה */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </CampaignsProvider>
    </AuthProvider>
  );
};

export default App;
