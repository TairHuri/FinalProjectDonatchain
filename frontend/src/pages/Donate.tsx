import { motion } from "framer-motion";

export default function Donate() {
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
        תרום עכשיו והשפיע
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: "1.2rem", maxWidth: "650px", margin: "0 auto" }}
      >
        התרומה שלך עוברת דרך מערכת בלוקצ'יין מאובטחת, עם שקיפות מלאה
        לגבי היעד והשימוש בכספים.  
        הבינה המלאכותית שלנו מתאימה את ההמלצות עבורך,
        כדי שתוכל לבחור את הקמפיין הקרוב ללבך.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: "2rem",
          padding: "0.8rem 2rem",
          fontSize: "1.2rem",
          fontWeight: "bold",
          borderRadius: "0.75rem",
          background: "linear-gradient(135deg, #3b6978, #8fa98f)",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        }}
      >
        בחר קמפיין לתרומה
      </motion.button>
    </div>
  );
}
