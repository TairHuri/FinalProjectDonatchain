import { Shield, UserCheck, Lock, Cpu, FileCode2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutRules() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
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
          <span className="font-semibold text-blue-700">בלוקצ'יין ובינה מלאכותית</span>
          השימוש במערכת כפוף לתקנון זה, שנועד לשמור על חוויית שימוש מאובטחת, שקופה ואחראית
        </p>

        <div className="space-y-10">
          {/* סעיף 1 */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 justify-end">
              <h3 className="text-2xl font-semibold text-blue-700"> כללי</h3>
              <Shield className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              מטרת המערכת היא להעניק פלטפורמה חדשנית לגיוס תרומות תוך שמירה על שקיפות,
              אבטחת מידע ואמינות מלאה. השימוש במערכת מהווה הסכמה מלאה לכל תנאי התקנון
            </p>
          </motion.section>

          {/* סעיף 2 */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 justify-end">
              <h3 className="text-2xl font-semibold text-blue-700"> אחריות המשתמש</h3>
              <UserCheck className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              המשתמש מתחייב להזין מידע מדויק ואמין בלבד, ולהימנע מכל שימוש לרעה במערכת
              כל פעולה שתבוצע בשם המשתמש היא באחריותו הבלעדית
            </p>
          </motion.section>

          {/* סעיף 3 */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 justify-end">
              <h3 className="text-2xl font-semibold text-blue-700"> פרטיות ושקיפות</h3>
              <Lock className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              אנו מתחייבים לשמור על פרטיות המשתמשים בהתאם לחוק. טכנולוגיית הבלוקצ'יין מבטיחה תיעוד שקוף של תרומות
              מבלי לחשוף מידע אישי רגיש, כדי לשמור על אמון וביטחון מלאים
            </p>
          </motion.section>

          {/* סעיף 4 */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 justify-end">
              <h3 className="text-2xl font-semibold text-blue-700"> שימוש בטכנולוגיה</h3>
              <Cpu className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              המערכת משלבת בינה מלאכותית לניתוח טקסטים והצעת קמפיינים רלוונטיים
              המלצות אלו אינן מחייבות והן נועדו לשפר את חוויית המשתמש בלבד
            </p>
          </motion.section>

          {/* סעיף 5 */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 justify-end">
              <h3 className="text-2xl font-semibold text-blue-700"> קניין רוחני</h3>
              <FileCode2 className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              כל הקוד, התוכן והעיצוב במערכת הם קניינם הבלעדי של צוות הפיתוח
              אין להעתיק, להפיץ או לעשות בהם שימוש ללא אישור כתוב מראש
            </p>
          </motion.section>

          {/* סעיף 6 */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-l from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3 justify-end">
              <h3 className="text-2xl font-semibold text-blue-700"> שינויים בתקנון</h3>
              <RefreshCcw className="text-blue-600" />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              הנהלת המערכת רשאית לעדכן את תנאי התקנון מעת לעת
              המשך השימוש במערכת לאחר עדכון ייחשב כהסכמה מלאה לתנאים החדשים
            </p>
          </motion.section>
        </div>

        <hr className="my-10 border-t-2 border-blue-200" />

        <p className="text-center text-xl font-semibold text-gray-800">
          תודה על האמון שלכם 💙  
          <br />
          יחד נבנה עתיד חכם, מאובטח ושקוף לעולם התרומות
        </p>
      </motion.div>
    </div>
  );
}
