import React, { useEffect, useState } from "react";
import { getAllCampaigns } from "../services/campaignApi"

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getAllCampaigns(token)
      .then(setCampaigns)
     .catch((err: unknown) => console.error("Failed to fetch campaigns:", err))

      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>טוען קמפיינים...</p>;

  return (
    <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">שם הקמפיין</th>
          <th className="border px-4 py-2">עמותה</th>
          <th className="border px-4 py-2">יעד</th>
          <th className="border px-4 py-2">נאסף</th>
          <th className="border px-4 py-2">סטטוס</th>
          <th className="border px-4 py-2">תאריך יצירה</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c: any) => (
          <tr key={c._id}>
            <td className="border px-4 py-2">{c.title}</td>
            <td className="border px-4 py-2">{c.ngo?.name || "לא ידוע"}</td>
            <td className="border px-4 py-2">{c.goal}</td>
            <td className="border px-4 py-2">{c.raised}</td>
            <td className="border px-4 py-2">{c.isActive ? "פעיל" : "לא פעיל"}</td>
            <td className="border px-4 py-2">{new Date(c.createdAt).toLocaleDateString("he-IL")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
