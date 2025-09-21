import { motion } from "framer-motion";

export default function Discover() {
  return (
    <div
      dir="rtl"
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        גלה עוד על המערכת שלנו
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}
      >
        פרויקט זה מציע מערכת חדשנית לגיוס תרומות המשלבת{" "}
        <strong>טכנולוגיית בלוקצ'יין</strong> לשקיפות מלאה וביטחון,
        יחד עם <strong>בינה מלאכותית</strong> לניתוח טקסטים, זיהוי צרכים
        ומתן המלצות מותאמות אישית לתורמים.  
        <br />
        המטרה – לחבר בין עמותות ותורמים בצורה חכמה, אמינה ושקופה.
      </motion.p>
    </div>
  );
}
