import { useState } from 'react';
import { Copy, MessageCircle, Share2, Check } from "lucide-react";
import type { Campaign } from '../../models/Campaign';

import '../../css/campaign/ShareCampaign.css'

// Component for sharing a campaign through different methods
const ShareCampaign = ({ campaign }: { campaign: Campaign }) => {
  const [copied, setCopied] = useState(false);

  // Generate a full URL to the campaign page
  const campaignUrl = `${window.location.origin}/campaign/${campaign._id}`;


  // Copy the campaign link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

// Share campaign through WhatsApp or fallback if browser doesn't support native share
const handleShareWhatsapp = () => {
  const text = `תראה את הקמפיין הזה: ${campaign.title} - ${campaignUrl}`;

  if (navigator.share) {
    navigator.share({ text, url: campaignUrl }).catch(() => {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  } else {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }
};


// Share using the device native share API (mobile supported mainly)
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
      {/* Sharing Section Card */}
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
        {/* Header text */}
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
          שתפו את הקמפיין ועזרו לנו להגיע לעוד אנשים
        </div>

        {/* Buttons group */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {/* Copy Link Button */}
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

          {/* WhatsApp Share Button */}
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