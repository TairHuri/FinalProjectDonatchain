import { useRef, useEffect, useState, type ReactNode, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, Cpu, Coins, type LucideIcon } from "lucide-react";
import "../css/Home.css";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import AISearchBar from "../components/AISearchBar";

import { getCampaignTags } from "../services/campaignApi";

/**
 * CategoriesSection Component
 * Displays campaign categories with icons and horizontal scroll navigation.
 * Fetches tag list dynamically from the backend.
 */
function CategoriesSection() {
 // DOM reference for horizontal scroller
  const scrollerRef = useRef<HTMLDivElement | null>(null);
 
  // Campaign tags received from API
  const [campaignTags, setCampaignTags] = useState<string[]>([])

    /**
   * Load categories from the API only when the component mounts
   */
  useEffect(() => {
    const loadTags = async () => {
      const tags = await getCampaignTags()
      setCampaignTags(tags);
    };
    loadTags();

  }, []);

  /**
   * Dynamically returns a Lucide icon component by its name (string from DB/API)
   */
  const getIcon = (name: string) => {

    const Icon = Icons[name as unknown as keyof typeof Icons] as LucideIcon

    return <Icon className="block-ic" />
  }

  /**
   * Scrolls the category list horizontally (smooth animation)
   */
  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = dir === "left" ? -320 : 320;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="categories" aria-label="קטגוריות קמפיינים">
      <div className="categories-head">
        <h2 className="categories-title">קמפיינים לפי קטגוריה</h2>
        <div className="categories-arrows" aria-hidden="true">
          <button className="cat-arrow" onClick={() => scroll("right")} title="גלול ימינה">↠</button>
          <button className="cat-arrow" onClick={() => scroll("left")} title="גלול שמאלה">↞</button>
        </div>
      </div>

      <div className="chain-grid" ref={scrollerRef}>
        {(campaignTags as unknown as { tag: string, icon: string }[]).map(({ tag, icon }) => (
          <Link key={tag} to={`/campaigns?tag=${encodeURIComponent(tag)}`} className="block-tile">
            <span className="block-face">
              {getIcon(icon)}
              <span className="mini-divider" />
              <span className="block-text">
                <b>{tag}</b>
              </span>
            </span>
            <span className="chain-link chain-top" aria-hidden="true" />
            <span className="chain-link chain-right" aria-hidden="true" />
            <span className="chain-link chain-bottom" aria-hidden="true" />
            <span className="chain-link chain-left" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Home Page Component
 * Represents the main landing page, including:
 * - Hero introduction section
 * - AI campaign search
 * - Dynamic campaign categories
 * - Explanation of blockchain usage
 * - Platform benefits overview
 * - Footer
 */
export default function Home() {
  return (
    <main className="home" dir="rtl">

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
          <motion.img
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }} src="/logoDonatchain.png" alt="DonatChain" className="logo-hero " />
        </div>

      </section>
      <section className="aiSearchSection">
        <AISearchBar />
      </section>
      <section>
        <CategoriesSection />
      </section>
      <section className="blockchainExplainationSection">
        <h2 className="blockchainExplainationTitle">מה זה בלוקצ'יין?</h2>
        <p >תחשבו על פנקס דיגיטלי ענק שכולם יכולים לראות, אבל אף אחד לא יכול לזייף.
          <br />
          כל תרומה שנעשית נרשמת בו באופן מאובטח ושקוף - בלי מתווכים ובלי סודות.
          <br />
          זו הדרך שלנו לוודא שכל שקל באמת מגיע ליעד שלו, ושאתם יכולים לתרום בשקט נפשי מלא ובאמון מוחלט.
        </p>
      </section>
      <section className="features">
        <article className="card">
          <ShieldCheck className="ic" />
          <h3>שקיפות מלאה</h3>
          <p>כל תרומה מתועדת בבלוקצ'יין - אמון מוחלט וגלוי לכולם</p>
        </article>

        <article className="card">
          <Cpu className="ic" />
          <h3>בינה מלאכותית</h3>
          <p>התאמה והמלצה חכמה במיוחד עבורך</p>
        </article>

        <article className="card">
          <Users className="ic" />
          <h3>קהילה מחבקת</h3>
          <p>עמותות ותורמים מחוברים במטרה אחת - לעשות טוב</p>
        </article>

        <article className="card">
          <Coins className="ic" />
          <h3>השפעה ומשמעות</h3>
          <p>כל תרומה בעלת ערך ועושה את ההבדל</p>
        </article>
      </section>

      <footer className="footer">
        © 2025 DonatChain — טוב משותף שמקדמים יחד
      </footer>
    </main>
  );
}

