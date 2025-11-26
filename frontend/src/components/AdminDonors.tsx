import { useEffect, useState } from "react";
import { getAllDonations } from "../services/donationApi";
import type { Donation } from "../models/Donation";

import "../css/admin/AdminDonors.css";

const AdminDonors = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllDonations();
        setDonations(data);
      } catch (error) {
        console.error("שגיאה בטעינת תרומות:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>טוען נתוני תרומות...</p>;

  return (
    <div className="admin-donors-card" dir="rtl">
    <div>
      <h2 className="h1-admin-donors">
        כל התורמים באתר
      </h2>

      <div style={{  marginTop: "15px" }}>
        {donations.length === 0 ? (
          <p>אין תרומות עדיין.</p>
        ) : (
          donations.map((d) => (
            <div
              key={d._id}
              style={{
                borderBottom: "1px solid #e5e7eb",
                padding: "10px 0",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>
                  {d.firstName} {d.lastName}
                </strong>{" "}
                | {d.email} | {d.phone}
              </p>

              <p style={{ margin: "3px 0", fontSize: "14px", color: "#555" }}>
                סכום: {d.amount} ₪ | קמפיין:{" "}
                {typeof d.campaign === "string"
                  ? "לא ידוע"
                  : (d.campaign as any)?.title || "לא ידוע"}
              </p>

              {d.comment && (
                <p style={{ fontSize: "13px", color: "#666" }}>
                  הערה: {d.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminDonors;
