// import { motion } from "framer-motion";

// export default function Discover() {
//   return (
//     <div
//       dir="rtl"
//       style={{
//         padding: "3rem 2rem",
//         textAlign: "center",
//         fontFamily:  "Fredoka, sans-serif",
//       }}
//     >
//       <motion.h1
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}
//       >
//         גלה עוד על המערכת שלנו
//       </motion.h1>

//       <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3 }}
//         style={{ fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto" }}
//       >
//         פרויקט זה מציע מערכת חדשנית לגיוס תרומות המשלבת{" "}
//         <strong>טכנולוגיית בלוקצ'יין</strong> לשקיפות מלאה וביטחון,
//         יחד עם <strong>בינה מלאכותית</strong> לניתוח טקסטים, זיהוי צרכים
//         ומתן המלצות מותאמות אישית לתורמים.  
//         <br />
//         המטרה – לחבר בין עמותות ותורמים בצורה חכמה, אמינה ושקופה.
//       </motion.p>
//     </div>
//   );
// }








   

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import "../css/general/Discover.css";


export default function Discover() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const steps = [
    { title: "בחירת קמפיין", desc: "דפדפי בין הקמפיינים…", img: "/discover/choose_campaign.png", alt: "מסך בחירת קמפיין" },
    { title: "פרטי תרומה", desc: "בחרי סכום ואמצעי תשלום…", img: "/discover/donate_form.png", alt: "מסך פרטי תרומה" },
    { title: "אישור התרומה", desc: "מאשרים בצורה מאובטחת…", img: "/discover/tx_confirm.png", alt: "מסך אישור תרומה" },
    { title: "שקיפות בבלוקצ׳יין", desc: "לחיצה על 🔥 מציגה את העסקה…", img: "/discover/blockchain_view.png", alt: "צפייה בעסקה" },
  ];

  const openWizard = () => setOpen(true);
  const closeWizard = useCallback(() => { setOpen(false); setStep(0); }, []);
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // למנוע גלילה ברקע כשמודאל פתוח
  useEffect(() => {
    if (!open && !zoomSrc) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open, zoomSrc]);

  // ESC לסגירה (גם למודאל וגם ל־zoom)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomSrc) setZoomSrc(null);
        else if (open) closeWizard();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, zoomSrc, closeWizard]);

  return (
    <div dir="rtl" className="dc-page">
      <section className="dc-hero">
        <motion.h1 className="dc-hero-title" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
          למה DonatChain מיוחדת?
        </motion.h1>
        <motion.p className="dc-hero-sub" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.1}}>
          שילוב של <strong>בלוקצ׳יין</strong> לשקיפות ואמינות,
          יחד עם <strong>בינה מלאכותית</strong> שמציעה קמפיינים מותאמים אישית.
        </motion.p>
        <div className="dc-hero-cta">
          <button className="dc-btn dc-btn-primary" onClick={openWizard}>אז איך זה עובד?</button>
        </div>
      </section>

      {/* מודאל השלבים */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              className="dc-backdrop" onClick={closeWizard} aria-label="סגירת חלונית"
              initial={{ opacity: 0 }} animate={{ opacity: .55 }} exit={{ opacity: 0 }}
            />
            <motion.div
              className="dc-modal" role="dialog" aria-modal="true" aria-labelledby="wizardTitle"
              initial={{ opacity: 0, scale:.98, y:12 }} animate={{ opacity: 1, scale:1, y:0 }}
              exit={{ opacity: 0, scale:.98, y:12 }} transition={{ type:"spring", stiffness:220, damping:20 }}
            >
              <div className="dc-card">
                <header className="dc-card-head">
                  <h2 id="wizardTitle">איך מתבצעת תרומה?</h2>
                  <button className="dc-iconBtn" onClick={closeWizard} aria-label="סגירה"><X size={18}/></button>
                </header>

                <div className="dc-dots" aria-hidden="true">
                  {steps.map((_, i) => <div key={i} className={`dc-dot ${i<=step?"is-active":""}`} />)}
                </div>

                <div className="dc-card-body">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step} className="dc-step"
                      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                      transition={{ duration:.22 }}
                    >
                      <div className="dc-step-media">
                        <button
                          className="dc-media-click"
                          onClick={() => setZoomSrc(steps[step].img)}
                          aria-label="הגדלת תמונה"
                        >
                          <img src={steps[step].img} alt={steps[step].alt}/>
                        </button>
                      </div>
                      <div className="dc-step-text">
                        <h3>{steps[step].title}</h3>
                        <p>{steps[step].desc}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <footer className="dc-card-foot">
                  <button className="dc-btn dc-btn-ghost less-round" onClick={prev} disabled={step===0}>
                    <ChevronRight size={18}/> חזרה
                  </button>
                  {step < steps.length-1 ? (
                    <button className="dc-btn dc-btn-primary less-round" onClick={next}>
                      המשך <ChevronLeft size={18}/>
                    </button>
                  ) : (
                    <button className="dc-btn dc-btn-primary less-round" onClick={closeWizard}>
                      סיום <CheckCircle2 size={18}/>
                    </button>
                  )}
                </footer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox לתמונה מוגדלת */}
      <AnimatePresence>
        {zoomSrc && (
          <>
            <motion.button
              className="dc-backdrop" onClick={() => setZoomSrc(null)} aria-label="סגירת תמונה"
              initial={{ opacity: 0 }} animate={{ opacity: .65 }} exit={{ opacity: 0 }}
            />
            <motion.div
              className="dc-lightbox" onClick={() => setZoomSrc(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.img
                src={zoomSrc} alt="" className="dc-lightbox-img"
                initial={{ scale:.92 }} animate={{ scale:1 }} exit={{ scale:.92 }}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

