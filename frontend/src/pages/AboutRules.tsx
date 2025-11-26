import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Shield, UserCheck, Lock, Cpu, FileCode2, RefreshCcw } from "lucide-react";

//  Mapping rule titles to specific icons for dynamic rendering
//  Consider using a typed union or enum for keys to improve type safety
const icons: Record<string, any> = {
  "כללי": Shield,
  "אחריות המשתמש": UserCheck,
  "פרטיות ושקיפות": Lock,
  "שימוש בטכנולוגיה": Cpu,
  "קניין רוחני": FileCode2,
  "שינויים בתקנון": RefreshCcw,
};

export default function AboutRules() {
   //  Holds the fetched website rules
  //  Replace `any[]` with a proper interface for stronger typing
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/rules`);
        setRules(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת התקנון:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  if (loading) return <p className="text-center mt-10">טוען תקנון...</p>;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 text-right border border-blue-100"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-blue-800 text-center">
          תקנון האתר
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
          ברוכים הבאים למערכת החדשנית לגיוס תרומות מבוססת{" "}
          <span className="font-semibold text-blue-700">בלוקצ'יין ובינה מלאכותית</span>.
          השימוש במערכת כפוף לתקנון זה, שנועד לשמור על חוויית שימוש מאובטחת, שקופה ואחראית.
        </p>

        <div className="space-y-10">
          {rules.map((rule, i) => {
            const Icon = icons[rule.title.trim()] || Shield;
            return (
              <motion.section
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3 justify-end">
                  <h3 className="text-2xl font-semibold text-blue-700">{rule.title}</h3>
                  <Icon className="text-blue-600" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">{rule.text}</p>
              </motion.section>
            );
          })}
        </div>

        <hr className="my-10 border-t-2 border-blue-200" />

        <p className="text-center text-xl font-semibold text-gray-800">
          תודה על האמון שלכם   
          <br />
          יחד נבנה עתיד חכם, מאובטח ושקוף לעולם התרומות
        </p>
      </motion.div>
    </div>
  );
}
