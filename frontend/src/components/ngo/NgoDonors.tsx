
import { useEffect, useState } from "react";
import { useCampaigns } from "../../contexts/CampaignsContext";
import type { Donation } from "../../models/Donation";
import { getDonationsByCampaign, getDonationsByNgo } from "../../services/donationApi";
import { useAuth } from "../../contexts/AuthContext";
import { Users, } from "lucide-react";
import PickerList, { usePickerList } from '../gui/PickerList';
import '../../css/ngo/NgoDonors.css'

const NgoDonors = () => {
  const { user } = useAuth(); // Current logged-in NGO user
  const { campaigns } = useCampaigns(); // All campaigns for this NGO
  const { openPicker, setOpenPicker, selectedItemId, setSelectedItemId } = usePickerList();
  
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load donors for a specific campaign
  const loadDonors = async (campaignId: string) => {
    setLoading(true);
    try {
      const rows: Donation[] = await getDonationsByCampaign(campaignId);
      const uniqueDonners: { [email: string]: Donation } = {}
      console.log(rows)
      // Keep only unique donations by email
      for (const d in rows) {
        uniqueDonners[rows[d].email] = rows[d];
      }
      setDonations(Object.values(uniqueDonners));
    } finally {
      setLoading(false);
    }
  };

  const loadNgoDonors = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const rows: Donation[] = await getDonationsByNgo(user.ngoId);
      const uniqueDonations: { [email: string]: Donation } = {}
      for (const d in rows) {
        uniqueDonations[rows[d].email] = rows[d];
      }
      setDonations(Object.values(uniqueDonations));
    } finally {
      setLoading(false);
    }
  };

  // Load NGO donors on component mount
  useEffect(() => {
    loadNgoDonors();
  }, []);

  // Reload donations whenever selected campaign changes
  useEffect(() => {
    if (selectedItemId === "all") {
      loadNgoDonors();
    } else if (selectedItemId) {
      loadDonors(selectedItemId);
    }
  }, [selectedItemId]);

  return (
    <div className="ngo-donors" dir="rtl">

      <div className="ngo-donors__header">
        <h2 className="ngo-donors__title"><Users size={18} /> תורמי העמותה</h2>

        <div className="toolbar">
          <PickerList openPicker={openPicker} setOpenPicker={setOpenPicker} selectedItemId={selectedItemId} setSelectedItemId={setSelectedItemId} list={campaigns.map(c => ({ _id: c._id!, name: c.title }))} />
          {selectedItemId !== "all" && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setSelectedItemId("all")}
              title="נקה סינון"
            >
              נקה
            </button>
          )}
        </div>
      </div>


      <div className="panel">
        <div className="panel__title">
          <Users size={18} /> {selectedItemId === "all" ? "כל התורמים" : "תורמי הקמפיין"}
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
