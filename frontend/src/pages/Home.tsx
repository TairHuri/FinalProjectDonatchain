// import React, { useEffect } from "react";
// import { motion } from "framer-motion";
// import { ShieldCheck, Users, Cpu, Coins } from "lucide-react";
// import { Link } from "react-router-dom"; // ✅ מוסיפים import

// export default function Home() {
//   useEffect(() => {
//     document.body.style.margin = "0";
//     document.body.style.padding = "0";
//     document.documentElement.style.margin = "0";
//     document.documentElement.style.padding = "0";
//   }, []);

//   return (
//     <div
//       style={{
        
//          width: "100%",
//          background: "linear-gradient(135deg, #e4d8e3ff, #f0f0f0)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//         color: "#9ba77d", // ✅ ירוק זית חלש חלש
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {/* Hero Section */}
//       <div style={{ padding: "5rem 2rem", maxWidth: "900px" }}>
//         <motion.img
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//           src="/logo.png"
//           alt="לוגו"
//           style={{ width: "400px", height: "auto", marginBottom: "2rem" }}
//         />

//         <motion.h1
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1 }}
//           style={{ fontSize: "3rem", marginBottom: "1rem" }}
//         >
//           פלטפורמת התרומות של העתיד
//         </motion.h1>

//         {/* ציטוט */}
//         <h2 style={{ fontSize: "1.6rem", marginBottom: "1.5rem", fontStyle: "italic" }}>
//           אנו מתקיימים ממה שאנחנו מקבלים <br />
//           אנחנו חיים ממה שאנחנו נותנים
//         </h2>

//         <p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.9 }}>
//           שילוב עוצמתי של בלוקצ'יין ובינה מלאכותית ליצירת אמון, שקיפות
//           והשפעה אמיתית בעולם התרומות.
//         </p>

//         {/* ✅ כפתורי CTA עם Link */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "center",
//             gap: "1rem",
//             marginTop: "2rem",
//           }}
//         >
//           <Link
//             to="/discover"
//             style={{
//               padding: "0.8rem 1.6rem",
//               background: "linear-gradient(135deg, #3b6978, #8fa98f)",
//               color: "white",
//               borderRadius: "0.75rem",
//               textDecoration: "none",
//               fontWeight: "bold",
//               fontSize: "1rem",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//             }}
//           >
//             גלה עוד
//           </Link>

//           <Link
//             to="/donate"
//             style={{
//               padding: "0.8rem 1.6rem",
//               background: "linear-gradient(135deg, #8fa98f, #3b6978)",
//               color: "white",
//               borderRadius: "0.75rem",
//               textDecoration: "none",
//               fontWeight: "bold",
//               fontSize: "1rem",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//             }}
//           >
//             תרום עכשיו
//           </Link>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//           gap: "1.5rem",
//           marginTop: "2rem",
//           width: "100%",
//           maxWidth: "1200px",
//         }}
//       >
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           style={{
//             background: "rgba(255,255,255,0.1)",
//             padding: "2rem",
//             borderRadius: "15px",
//             boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
//           }}
//         >
//           <ShieldCheck size={40} color="#00e676" />
//           <h3 style={{ marginTop: "1rem" }}>שקיפות מלאה</h3>
//           <p>כל תרומה מתועדת בבלוקצ'יין – אמון מובטח.</p>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           style={{
//             background: "rgba(255,255,255,0.1)",
//             padding: "2rem",
//             borderRadius: "15px",
//             boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
//           }}
//         >
//           <Cpu size={40} color="#80d8ff" />
//           <h3 style={{ marginTop: "1rem" }}>בינה מלאכותית</h3>
//           <p>ניתוח טקסטים והמלצות מותאמות אישית לכל תורם.</p>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           style={{
//             background: "rgba(255,255,255,0.1)",
//             padding: "2rem",
//             borderRadius: "15px",
//             boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
//           }}
//         >
//           <Users size={40} color="#ffd600" />
//           <h3 style={{ marginTop: "1rem" }}>קהילה תומכת</h3>
//           <p>אלפי תורמים יוצרים שינוי אמיתי יחד.</p>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           style={{
//             background: "rgba(255,255,255,0.1)",
//             padding: "2rem",
//             borderRadius: "15px",
//             boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
//           }}
//         >
//           <Coins size={40} color="#ff9100" />
//           <h3 style={{ marginTop: "1rem" }}>השפעה אמיתית</h3>
//           <p>כל שקל מגיע ישירות ליעדו – ללא פשרות.</p>
//         </motion.div>
//       </div>

//       {/* How it Works Section */}
//       <div
//         style={{
         
//           marginTop: "5rem",
//           padding: "2rem",
//           maxWidth: "900px",
//           textAlign: "center",
//         }}
//       >
//         <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
//           איך זה עובד?
//         </h2>
//         <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
//           בחר עמותה או מיזם → בצע תרומה מאובטחת בבלוקצ'יין →  
//           קבל ניתוח מותאם אישית מהבינה המלאכותית שלנו →  
//           עקוב אחר ההשפעה שלך בזמן אמת.
//         </p>
//       </div>

//       {/* Footer */}
//       <footer
//         style={{
//           marginTop: "4rem",
//           padding: "1rem",
//           borderTop: "1px solid rgba(255,255,255,0.2)",
//           fontSize: "0.9rem",
//           color: "#eee",
//           width: "100%",
//         }}
//       >
//         © 2025 כל הזכויות שמורות - פלטפורמת תרומות | תאיר מלכה & רננה חושן
//       </footer>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, Cpu, Coins } from "lucide-react";
import "../css/Home.css";

export default function Home() {
  return (
    <main className="home" dir="rtl">
      {/* HERO (ימין טקסט / שמאל לוגו) */}
      <section className="hero">
        <div className="hero-right">
          <h1 className="title">פלטפורמת התרומות של העתיד</h1>

          <h2 className="quote">
            אנו מתקיימים ממה שאנחנו מקבלים<br />
            אנחנו חיים ממה שאנחנו נותנים
          </h2>

          <p className="lead">
            שילוב עוצמתי של בלוקצ'יין ובינה מלאכותית <br /> ליצירת אמון, שקיפות
            והשפעה אמיתית בעולם התרומות.
          </p>

          <div className="cta">
            <Link to="/discover" className="btn btn-primary">גלה עוד</Link>
            <Link to="/donate" className="btn btn-ghost">תרום עכשיו</Link>
          </div>
        </div>

        <div className="hero-left">
          <img src="/logoDonatchain.png" alt="DonatChain" className="logo-hero" />
        </div>
      </section>

      {/* יתרונות */}
      <section className="features">
        <article className="card">
          <ShieldCheck className="ic" />
          <h3>שקיפות מלאה</h3>
          <p>כל תרומה מתועדת בבלוקצ'יין — אמון מוחלט וגלוי לכולם.</p>
        </article>

        <article className="card">
          <Cpu className="ic" />
          <h3>בינה מלאכותית</h3>
          <p>התאמת תרומות חכמה לפי ערכים ותחומי עניין.</p>
        </article>

        <article className="card">
          <Users className="ic" />
          <h3>קהילה מחבקת</h3>
          <p>עמותות ותורמים מחוברים במטרה אחת — לעשות טוב.</p>
        </article>

        <article className="card">
          <Coins className="ic" />
          <h3>השפעה נמדדת</h3>
          <p>עקבו בזמן אמת אחרי ההשפעה של כל תרומה.</p>
        </article>
      </section>

      {/* איך זה עובד */}
      <section className="how">
        <h2>איך זה עובד?</h2>
        <div className="steps">
          <div className="step"><span className="dot">1</span> בוחרים עמותה</div>
          <div className="step"><span className="dot">2</span> תורמים בבטחה</div>
          <div className="step"><span className="dot">3</span> מקבלים תובנות חכמות</div>
          <div className="step"><span className="dot">4</span> רואים את ההשפעה</div>
        </div>
      </section>

      <footer className="footer">
        © 2025 DonatChain — טוב משותף שמתקדם ביחד
      </footer>
    </main>
  );
}

