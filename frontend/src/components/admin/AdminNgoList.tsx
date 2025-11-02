import React, { useEffect, useState } from "react";
import { getNgoList, toggleNgoStatus } from "../../services/ngoApi";
import { Loader2, PauseCircle, PlayCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface Ngo {
  _id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  logoUrl?: string;
  ngoNumber?: string;
  createdAt?: string;
  ngoCampaignsCount?: number;
}

export default function AdminNgoList() {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedNgo, setSelectedNgo] = useState<Ngo | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchNgos();
  }, []);

const fetchNgos = async () => {
  try {
    setLoading(true);
    const res = await getNgoList();
    const ngosWithDates = res.items.map((ngo: any) => ({
      ...ngo,
      createdAt: new Date(ngo.createdAt),
    }));
    setNgos(ngosWithDates);
  } catch (err) {
    console.error("שגיאה בטעינת רשימת עמותות:", err);
  } finally {
    setLoading(false);
  }
};


  const handleToggle = async (id: string) => {
    if (!window.confirm("האם את/ה בטוח/ה שברצונך לשנות את סטטוס העמותה?")) return;

    try {
      setActionLoading(id);
      const res = await toggleNgoStatus(id, token);
      alert(res.message);
      await fetchNgos();
    } catch (err) {
      console.error(err);
      alert("שגיאה בעדכון הסטטוס");
    } finally {
      setActionLoading(null);
    }
  };

  const showNgoDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/ngos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedNgo(res.data);
    } catch (err) {
      console.error("שגיאה בשליפת פרטי עמותה:", err);
      alert("שגיאה בשליפת פרטי עמותה");
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-6 text-gray-600">טוען עמותות...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <table className="w-full border border-gray-300 shadow-sm rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2 border">שם עמותה</th>
            <th className="p-2 border">מספר</th>
            <th className="p-2 border">סטטוס</th>
            <th className="p-2 border">תאריך יצירה</th>
            <th className="p-2 border text-center">פעולות</th>
          </tr>
        </thead>
        <tbody>
          {ngos.map((n) => (
            <tr
              key={n._id}
              className={`transition ${
                n.isActive
                  ? "bg-white hover:bg-green-50"
                  : "bg-gray-100 opacity-80"
              }`}
            >
              <td className="p-2 border font-semibold text-blue-600">
                {n.name}
              </td>
              <td className="p-2 border">{n.ngoNumber || "-"}</td>
              <td
                className={`p-2 border font-bold ${
                  n.isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {n.isActive ? "פעילה" : "מושהית"}
              </td>
              <td className="p-2 border">
                {n.createdAt
                  ? new Date(n.createdAt).toLocaleDateString("he-IL")
                  : "-"}
              </td>
              <td className="p-2 border text-center flex justify-center gap-3">
                {/* כפתור הצג */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => showNgoDetails(n._id)}
                  className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-white font-semibold shadow bg-blue-600 hover:bg-blue-700 transition"
                >
                  <Eye size={18} />
                  הצג
                </motion.button>

                {/* כפתור השהה / הפעל */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={actionLoading === n._id}
                  onClick={() => handleToggle(n._id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow transition-all ${
                    n.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } disabled:opacity-60`}
                >
                  {actionLoading === n._id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : n.isActive ? (
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
          ))}
        </tbody>
      </table>

{/* חלון פרטי עמותה */}
{selectedNgo && (
  <motion.div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setSelectedNgo(null)}
  >
    <motion.div
      initial={{ scale: 0.8, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative bg-white w-full max-w-md md:max-w-lg rounded-2xl shadow-2xl p-6 text-right"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setSelectedNgo(null)}
        className="absolute top-3 left-3 text-gray-500 hover:text-gray-800 transition"
      >
        ✖
      </button>

      {detailsLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-gray-600" size={36} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            {selectedNgo.logoUrl && (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${selectedNgo.logoUrl}`}
                alt="לוגו העמותה"
                className="w-24 h-24 object-cover rounded-full shadow mb-3"
              />
            )}
            <h3 className="text-2xl font-bold text-gray-800">
              {selectedNgo.name}
            </h3>
          </div>

          <div className="space-y-2 text-gray-700">
            <p>
              <b>תיאור:</b> {selectedNgo.description || "אין תיאור"}
            </p>
            <p>
              <b>אימייל:</b> {selectedNgo.email || "לא צוין"}
            </p>
            <p>
              <b>טלפון:</b> {selectedNgo.phone || "לא צוין"}
            </p>
            <p>
              <b>סטטוס:</b>{" "}
              <span
                className={`font-semibold ${
                  selectedNgo.isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {selectedNgo.isActive ? "פעילה" : "מושהית"}
              </span>
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => setSelectedNgo(null)}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition"
            >
              סגור
            </button>
          </div>
        </>
      )}
    </motion.div>
  </motion.div>
)}
    </motion.div>  
  );
}
