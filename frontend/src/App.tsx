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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CampaignsProvider>
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
          {/* סרגל ניווט עליון */}
          <Navbar />

          {/* תוכן ראשי */}
          <div className="flex-1 p-4 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/about" element={<About />} />
              <Route path="/login/ngo" element={<LoginNgo />} />
              <Route path="/registration/ngo" element={<RegistrationNgo />} />
              <Route path="/donors/ngo" element={<DonorsNgo />} />
              <Route path="/ngo/home" element={<NgoDashboard />} />
              <Route path="/campaign/:id" element={<CampaignDetails />} />
              <Route path="/campaigns/new" element={<NewCampaign />} />
            </Routes>
          </div>
        </div>
      </CampaignsProvider>
    </AuthProvider>
  );
};

export default App;
