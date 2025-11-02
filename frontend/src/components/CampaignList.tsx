import React, { useEffect, useState } from "react";
import { getAllCampaigns, toggleCampaignStatus } from "../services/campaignApi";
import { PauseCircle, PlayCircle, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

import '../css/adminDashboard.css'

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused">("all");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, campaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getAllCampaigns(token);
      setCampaigns(data);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await toggleCampaignStatus(id, token);
      alert(res.message || "הסטטוס עודכן בהצלחה ✅");
      await fetchCampaigns(); // רענון הנתונים
    } catch (err) {
      console.error(err);
      alert("שגיאה בעדכון הסטטוס ❌");
    } finally {
      setActionLoading(null);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    // סינון לפי טקסט בחיפוש
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.ngo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // סינון לפי סטטוס
    if (statusFilter === "active") {
      filtered = filtered.filter((c) => c.isActive);
    } else if (statusFilter === "paused") {
      filtered = filtered.filter((c) => !c.isActive);
    }

    setFilteredCampaigns(filtered);
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">טוען קמפיינים...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-6"
    >
      {/* 🔍 אזור חיפוש וסינון */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* שדה חיפוש */}
        <div className="relative w-full md:w-1/3">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="חפש לפי שם קמפיין או עמותה..."
            className="w-full border border-gray-300 rounded-xl px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* סינון לפי סטטוס */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "paused")}
          className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="all">הצג הכול</option>
          <option value="active">רק פעילים</option>
          <option value="paused">רק מושהים</option>
        </select>
      </div>

      {/* טבלה */}
      <table className="table-auto w-full border-collapse border border-gray-300 rounded-xl overflow-hidden shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border px-4 py-2">שם הקמפיין</th>
            <th className="border px-4 py-2">עמותה</th>
            <th className="border px-4 py-2">יעד</th>
            <th className="border px-4 py-2">נאסף</th>
            <th className="border px-4 py-2">סטטוס</th>
            <th className="border px-4 py-2">תאריך יצירה</th>
            <th className="border px-4 py-2">פעולה</th>
          </tr>
        </thead>
        <tbody>
          {filteredCampaigns.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                לא נמצאו קמפיינים תואמים 🔎
              </td>
            </tr>
          ) : (
            filteredCampaigns.map((c: any) => (
              <tr
                key={c._id}
                className={`transition-all duration-300 ${
                  c.isActive
                    ? "bg-white hover:bg-blue-50"
                    : "bg-gray-100 opacity-80 hover:opacity-100"
                }`}
              >
                <td className="border px-4 py-2 font-semibold text-blue-700">
                  {c.title}
                </td>
                <td className="border px-4 py-2">{c.ngo?.name || "לא ידוע"}</td>
                <td className="border px-4 py-2">{c.goal}</td>
                <td className="border px-4 py-2">{c.raised}</td>
                <td
                  className={`border px-4 py-2 font-bold ${
                    c.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {c.isActive ? "פעיל" : "מושהה"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(c.createdAt).toLocaleDateString("he-IL")}
                </td>
                <td className="border px-4 py-2 text-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggle(c._id)}
                    disabled={actionLoading === c._id}
                    className={`flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg text-white font-semibold shadow transition-all duration-300 ${
                      c.isActive
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } disabled:opacity-60`}
                  >
                    {actionLoading === c._id ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : c.isActive ? (
                      <>
                        <PauseCircle size={20} /> השהה
                      </>
                    ) : (
                      <>
                        <PlayCircle size={20} /> הפעל
                      </>
                    )}
                  </motion.button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  );
}
