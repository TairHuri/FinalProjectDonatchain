import { Shield, UserCheck, Lock, Cpu, FileCode2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RulesViewer() {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rules`);
        setRules(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת התקנון:", err);
      }
    };
    fetchRules();
  }, []);

  if (!rules.length) return <p className="text-center mt-10">טוען תקנון...</p>;

  const icons = [Shield, UserCheck, Lock, Cpu, FileCode2, RefreshCcw];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <motion.div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 text-right border border-blue-100">
        <h2 className="text-4xl font-extrabold mb-6 text-blue-800 text-center">תקנון האתר</h2>
        {rules.map((rule, i) => {
          const Icon = icons[i] || Shield;
          return (
            <motion.section key={i} whileHover={{ scale: 1.02 }} className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-3 justify-end">
                <h3 className="text-2xl font-semibold text-blue-700">{rule.title}</h3>
                <Icon className="text-blue-600" />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">{rule.text}</p>
            </motion.section>
          );
        })}
      </motion.div>
    </div>
  );
}
