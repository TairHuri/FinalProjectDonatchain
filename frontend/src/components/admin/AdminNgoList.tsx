import React, { useEffect, useState } from "react";
import { getNgoList, toggleNgoStatus } from "../../services/ngoApi";
import { Loader2, PauseCircle, PlayCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import Modal from "../gui/Modal";
import AdminNgoDetails from "./AdminNgoDetails";
import type { Ngo } from "../../models/Ngo";
import AlertDialog, { useAlertDialog } from "../gui/AlertDialog";


export default function AdminNgoList() {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedNgo, setSelectedNgo] = useState<Ngo | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const token = localStorage.getItem("token") || "";

  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();

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
      setAlert("שגיאה בטעינת רשימת עמותות:", true);
    } finally {
      setLoading(false);
    }
  };


  const handleToggle = async (id: string) => {
    if (!window.confirm("האם את/ה בטוח/ה שברצונך לשנות את סטטוס העמותה?")) return;

    try {
      setActionLoading(id);
      const res = await toggleNgoStatus(id, token);
      setAlert(res.message, false);
      await fetchNgos();
    } catch (err) {
      setAlert("שגיאה בעדכון הסטטוס", true);
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
      setAlert("שגיאה בשליפת פרטי עמותה", true);
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
      <div>
        <h2 style={{ color: "#059669", fontFamily: 'calibri', fontSize: "28px", fontWeight: "bold", margin: '10px auto' }}>רשימת עמותות</h2>
      </div>
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
              className={`transition ${n.isActive
                  ? "bg-white hover:bg-green-50"
                  : "bg-gray-100 opacity-80"
                }`}
            >
              <td className="p-2 border font-semibold text-blue-600">
                {n.name}
              </td>
              <td className="p-2 border">{n.ngoNumber || "-"}</td>
              <td
                className={`p-2 border font-bold ${n.isActive ? "text-green-600" : "text-red-500"
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
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold shadow transition-all ${n.isActive
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
         <AlertDialog
                show={showAlert}
                failureTitle="שגיאה"
                successTitle=""
                message={message}
                failureOnClose={clearAlert}
                isFailure={isFailure}
              />
      {/* חלון פרטי עמותה */}
      <Modal show={selectedNgo != null} onClose={() => setSelectedNgo(null)}>
        <AdminNgoDetails setSelectedNgo={setSelectedNgo} detailsLoading={detailsLoading} selectedNgo={selectedNgo!}/>
      </Modal>
    </motion.div>
  );
}

