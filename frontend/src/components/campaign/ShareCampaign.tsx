
import { useState } from 'react';
// import { Share2, Facebook, Send, MessageCircle } from "lucide-react";
import { Copy, MessageCircle, Share2, Check } from "lucide-react";
import type { Campaign } from '../../models/Campaign';

import '../../css/ShareCampaign.css'

const ShareCampaign = ({ campaign }: { campaign: Campaign }) => {
  const [copied, setCopied] = useState(false);

  const campaignUrl = window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
    }
  };


  const handleShareWhatsapp = () => {
    const text = `תראה את הקמפיין הזה: ${campaign.title} - ${campaignUrl}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };


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

      handleCopyLink();
    }
  };
  return (
    <div className='share-row'>
      {/* חדש: שיתוף הקמפיין */}
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
          שתפו את הקמפיין ותעזרו לנו להגיע לעוד אנשים
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
      </div>

    </div>
  )
}

export default ShareCampaign;