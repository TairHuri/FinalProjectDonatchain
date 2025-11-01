import React, { useEffect, useState } from "react";
import { getNgoList, toggleNgoStatus } from "../../services/ngoApi";
import { Loader2, PauseCircle, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminNgoList() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => { fetchNgos(); }, []);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const res = await getNgoList();
      setNgos(res.items);
    } catch (err) {
      console.error(err);
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
      alert("שגיאה בעדכון הסטטוס ❌");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <p className="text-center mt-6 text-gray-600">טוען עמותות...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <table className="w-full border border-gray-300 shadow-sm rounded-xl">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="p-2 border">שם עמותה</th>
            <th className="p-2 border">מספר</th>
            <th className="p-2 border">סטטוס</th>
            <th className="p-2 border">תאריך יצירה</th>
            <th className="p-2 border text-center">פעולה</th>
          </tr>
        </thead>
        <tbody>
          {ngos.map((n) => (
            <tr
              key={n._id}
              className={`transition ${
                n.isActive ? "bg-white hover:bg-green-50" : "bg-gray-100 opacity-80"
              }`}
            >
              <td className="p-2 border font-semibold text-blue-600">{n.name}</td>
              <td className="p-2 border">{n.ngoNumber || "-"}</td>
              <td className={`p-2 border font-bold ${n.isActive ? "text-green-600" : "text-red-500"}`}>
                {n.isActive ? "פעילה" : "מושהית"}
              </td>
              <td className="p-2 border">{new Date(n.createdAt).toLocaleDateString("he-IL")}</td>
              <td className="p-2 border text-center">
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
    </motion.div>
  );
}
