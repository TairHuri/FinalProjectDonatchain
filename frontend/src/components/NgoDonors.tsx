// import { useEffect, useState } from "react";
// import { useCampaigns } from "../contexts/CampaignsContext";
// import CampaignItem, { CampaignDonors } from "./CampaignItem";
// import type { Donation } from "../models/Donation";

// import { getDonationsByCampaign, getDonationsByNgo} from "../services/donationApi";
// import { useAuth } from "../contexts/AuthContext";
// import { buttonStyle } from "../css/dashboardStyles";




// const NgoDonors = () => {
//     const {user} =useAuth()
//     const {campaigns} = useCampaigns()
//     const [donations, setDonations] = useState<Donation[]>([]);
//     const loadDonors = async (campaignId:string) => {
//         const donations = await getDonationsByCampaign(campaignId);
//         setDonations(donations);
//     }
//     const loadNgoDonors = async () => {
//         if(!user)return;        
//         const donations = await getDonationsByNgo(user.ngoId);
//         setDonations(donations);
//     }
    
//     return (
//         <div>
//             <h2>תורמי העמותה</h2>
//             <button  type='button' onClick={loadNgoDonors} style={buttonStyle}>כל התורמים </button>
//             <div style={{height:'25vh', overflowY:'auto'}}>
//                 {campaigns.map((c) => <CampaignDonors key={c._id} campaign={c} onClick={()=>loadDonors(c._id!)}/>)}
//             </div>
//             <div style={{height:'30vh', overflowY:'auto'}}>
//                 {donations.map(d => <p key={d._id}>{`${d.firstName} ${d.lastName} ${d.email} ${d.phone}`}</p>)}
//             </div>
//         </div>
//     )
// }

// export default NgoDonors

// src/components/NgoDonors.tsx

import '../css/NgoDonors.css'

import { useEffect, useMemo, useState } from "react";
import { useCampaigns } from "../contexts/CampaignsContext";
import type { Donation } from "../models/Donation";
import { getDonationsByCampaign, getDonationsByNgo } from "../services/donationApi";
import { useAuth } from "../contexts/AuthContext";
import { Users, Gift, ChevronDown, X, Search } from "lucide-react";

const NgoDonors = () => {
  const { user } = useAuth();
  const { campaigns } = useCampaigns();

  // ✅ חדש: בחירת קמפיין / חיפוש
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | "all">("all");
  const [openPicker, setOpenPicker] = useState(false);
  const [query, setQuery] = useState("");

  // ✅ קיים: תרומות
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  const visibleCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter((c) => c.title?.toLowerCase().includes(q));
  }, [campaigns, query]);

  const loadDonors = async (campaignId: string) => {
    setLoading(true);
    try {
      const rows = await getDonationsByCampaign(campaignId);
      setDonations(rows);
    } finally {
      setLoading(false);
    }
  };

  const loadNgoDonors = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const rows = await getDonationsByNgo(user.ngoId);
      setDonations(rows);
    } finally {
      setLoading(false);
    }
  };

  // ברירת-מחדל: טען את כל התורמים
  useEffect(() => {
    loadNgoDonors();
  }, []);

  // כאשר המשתמש בוחר קמפיין / “כל הקמפיינים”
  useEffect(() => {
    if (selectedCampaignId === "all") {
      loadNgoDonors();
    } else if (selectedCampaignId) {
      loadDonors(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  return (
    <div className="ngo-donors" dir="rtl">
      {/* כותרת + בר כלים אינטראקטיבי */}
      <div className="ngo-donors__header">
        <h2 className="ngo-donors__title"><Users size={18}/> תורמי העמותה</h2>

        <div className="toolbar">
          {/* בורר קמפיין (פתיח/סגירה) */}
          <div className="picker">
            <button
              type="button"
              className="picker__button"
              onClick={() => setOpenPicker((v) => !v)}
              aria-expanded={openPicker}
              aria-haspopup="listbox"
            >
              <Gift size={16}/>
              <span className="picker__label">
                {selectedCampaignId === "all" ? "כל הקמפיינים" : (campaigns.find(c => c._id === selectedCampaignId)?.title ?? "בחרו קמפיין")}
              </span>
              <ChevronDown size={16} className={`chev ${openPicker ? "open" : ""}`} />
            </button>

            {openPicker && (
              <div className="picker__panel" role="listbox">
                {/* חיפוש בתוך הרשימה */}
                <div className="picker__search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="חיפוש קמפיין..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button className="picker__clear" onClick={() => setQuery("")} type="button" aria-label="נקה חיפוש">
                      <X size={16} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className={`picker__option ${selectedCampaignId === "all" ? "active" : ""}`}
                  onClick={() => { setSelectedCampaignId("all"); setOpenPicker(false); }}
                >
                  כל הקמפיינים
                </button>

                <div className="picker__list custom-scroll">
                  {visibleCampaigns.length === 0 && (
                    <div className="picker__empty">לא נמצאו קמפיינים</div>
                  )}
                  {visibleCampaigns.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      className={`picker__option ${selectedCampaignId === c._id ? "active" : ""}`}
                      onClick={() => { setSelectedCampaignId(c._id!); setOpenPicker(false); }}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ניקוי בחירה */}
          {selectedCampaignId !== "all" && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setSelectedCampaignId("all")}
              title="נקה סינון"
            >
              נקה
            </button>
          )}
        </div>
      </div>

      {/* תוכן: רשימת תורמים */}
      <div className="panel">
        <div className="panel__title">
          <Users size={18}/> {selectedCampaignId === "all" ? "כל התורמים" : "תורמי הקמפיין"}
          {loading && <span className="loader" aria-label="טוען…"></span>}
        </div>

        <div className="donors-grid custom-scroll">
          {!loading && donations.length === 0 && (
            <div className="empty-state">אין תרומות להצגה</div>
          )}

          {donations.map((d) => (
            <div key={d._id} className="donor-card">
              <div className="donor-card__name">
                {d.firstName} {d.lastName}
              </div>
              <div className="donor-card__meta">
                {d.email && <span className="chip">{d.email}</span>}
                {d.phone && <span className="chip">{d.phone}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NgoDonors;
