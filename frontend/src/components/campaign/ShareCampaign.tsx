
import {useState} from 'react';
// import { Share2, Facebook, Send, MessageCircle } from "lucide-react";
import { Copy, MessageCircle, Share2, Check } from "lucide-react";
import type { Campaign } from '../../models/Campaign';

import '../../css/ShareCampaign.css'

const ShareCampaign = ({campaign}:{campaign:Campaign}) => {
  const [copied, setCopied] = useState(false);
// ✅ חדש: לינק הקמפיין לשיתוף
  const campaignUrl = window.location.href;

  // ✅ חדש: העתקה ללוח
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // יחזור אחרי 2 שניות
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  // ✅ חדש: וואטסאפ
  const handleShareWhatsapp = () => {
    const text = `תראה את הקמפיין הזה: ${campaign.title} - ${campaignUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  // ✅ חדש: שיתוף דפדפן (אם קיים, למשל מובייל)
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: `תראה את הקמפיין הזה: ${campaign.title}`,
        url: campaignUrl,
      }).catch(err => {
        console.error("share cancelled or failed", err);
      });
    } else {
      // אם אין תמיכה ב-navigator.share פשוט נעשה העתקה
      handleCopyLink();
    }
  };
  return(
    <div className='share-row'>
      {/* ✅ חדש: שיתוף הקמפיין */}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 8px 16px rgba(0,0,0,0.03)",
          fontFamily: "calibri",
        }}
      >
        {/* טקסט עליון */}
        <div
          style={{
            fontSize: "0.9rem",
            color: "#1f2937",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: "12px",
          }}
        >
          שתפו את הקמפיין ותעזרו לנו להגיע לעוד אנשים 🙏
        </div>

        {/* קבוצת הכפתורים */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {/* כפתור העתקה */}
           <button
          className="campaign-share-btn"
          onClick={handleCopyLink}
          type="button"
        >
          <div
            className={
              "campaign-share-iconCircle copy" +
              (copied ? " copied" : "")
            }
          >
            {copied ? (
              <Check size={22} color="currentColor" strokeWidth={2.5} />
            ) : (
              <Copy size={22} color="currentColor" strokeWidth={2} />
            )}
          </div>
          <div
            className={
              "campaign-share-label" +
              (copied ? " copiedText" : "")
            }
          >
            {copied ? "הועתק" : "העתק"}
          </div>
        </button>

          {/* כפתור וואטסאפ */}
           <button
          className="campaign-share-btn"
          onClick={handleShareWhatsapp}
          type="button"
        >
          <div className="campaign-share-iconCircle whatsapp">
            <MessageCircle size={22} color="currentColor" strokeWidth={2} />
          </div>
          <div className="campaign-share-label">וואטסאפ</div>
        </button>

          {/* כפתור שיתוף (טלפון / רשתות) */}
             <button
          className="campaign-share-btn"
          onClick={handleNativeShare}
          type="button"
        >
          <div className="campaign-share-iconCircle share">
            <Share2 size={22} color="currentColor" strokeWidth={2} />
          </div>
          <div className="campaign-share-label">שיתוף…</div>
        </button>
        </div>

        {/* הצגת הכתובת עצמה (למי שרוצה להעתיק ידנית) */}
        <div
          style={{
            marginTop: "12px",
            fontSize: "0.7rem",
            color: "#6b7280",
            textAlign: "center",
            wordBreak: "break-all",
            lineHeight: 1.4,
          }}
        >
          {campaignUrl}
        </div>
      </div>

    </div>
  )
}

export default ShareCampaign;