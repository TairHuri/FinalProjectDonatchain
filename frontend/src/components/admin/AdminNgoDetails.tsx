import { motion } from "framer-motion";
import { Loader2} from "lucide-react";
import type { Ngo } from "../../models/Ngo";

import '../../css/admin/AdminNgoDetails.css'

export type AdminNgoDetailsProps={
  setSelectedNgo:(p:null)=>void;
  detailsLoading:boolean;
  selectedNgo:Ngo;
}

const AdminNgoDetails = ({setSelectedNgo, detailsLoading, selectedNgo}:AdminNgoDetailsProps) => {
  return(
    <motion.div
          className="inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
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
                      src={`${import.meta.env.VITE_IMAGES_URL}/${selectedNgo.logoUrl}`}
                      alt="לוגו העמותה"
                      className="w-24 h-24 object-cover rounded-full shadow mb-3 admin-ngo-logo"
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
                    <b>אימייל:</b> {selectedNgo.email ?<span className='field-ltr'>{selectedNgo.email}</span> : "לא צוין"}
                  </p>
                  <p>
                    <b>טלפון:</b> {selectedNgo.phone || "לא צוין"}
                  </p>
                  <p>
                    <b>סטטוס:</b>{" "}
                    <span
                      className={`font-semibold ${selectedNgo.isActive ? "text-green-600" : "text-red-500"
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
  )
}

export default AdminNgoDetails