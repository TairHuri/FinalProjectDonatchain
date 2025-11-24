
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCampaigns } from "../contexts/CampaignsContext";
import { getCampaign } from "../services/api";

// Components
import CreditPayment from "../components/CreditPayment";
import CryptoPayment from "../components/CryptoPayment";
import Modal from "../components/gui/Modal";
import CampaignDonations from "../components/campaign/CampaignDonations";
import NgoDetailsCard from "../components/ngo/NgoDetailsCard";
import ShareCampaign from "../components/campaign/ShareCampaign";

// Types
import type { Ngo } from "../models/Ngo";
import { type Campaign } from "../models/Campaign";

// Icons
import { Calendar, Clock, Tag, Link as LinkIcon, Users, CreditCard, Bitcoin} from "lucide-react";

import '../css/campaign/CampaignPage.css';

const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
const CAMPAIGM_DEATAILS_URL = import.meta.env.VITE_CAMPAIGN_DEATAILS_ON_CHAIN_URL || "https://sepolia.etherscan.io/address/0x738eC6b1a557d2a3E0304d159Cc5542B5CEF2BD3#readContract#F1";

// Helpers
function endOfDay(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return d;
}
function startOfDay(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}
function formatDate(dateStr?: string) {
  if (!dateStr) return "לא נקבע";
  return new Date(dateStr).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

const CampaignPage: React.FC = () => {
  const params = useParams();
  const { campaigns } = useCampaigns();

  const [showCreditPay, setShowCreditPay] = useState<boolean>(false);
  const [showCryptoPay, setShowCryptoPay] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"project" | "ngo" | "donations">("project");
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // Gallery State
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);

  const loadCampaign = async (id: string) => {
    try {
      const data = await getCampaign(id);
      setCampaign(data);
      if (data?.images && data.images.length > 0) {
        setSelectedMedia(data.images[0]);
        setIsVideo(false);
      }
    } catch (err) {
      console.error("Failed loading campaign", err);
    }
  };

  useEffect(() => {
    if (!params.id) return;
    const existing = campaigns.find((c) => c._id === params.id);
    if (existing) {
      setCampaign(existing);
      if (existing.images?.length > 0) setSelectedMedia(existing.images[0]);
    } else {
      loadCampaign(params.id);
    }
  }, [params, campaigns]);

  const isPayable = () => {
    if (!campaign) return false;
    const end = endOfDay(campaign.endDate);
    const start = startOfDay(campaign.startDate);
    return campaign.isActive && end && end >= new Date() && start && start <= new Date();
  };

  const handleMediaClick = (src: string, isVid: boolean) => {
    setSelectedMedia(src);
    setIsVideo(isVid);
  };

  if (!campaign) return <div style={{ textAlign: 'center', marginTop: 50 }}>טוען קמפיין...</div>;

  const percent = Math.min((campaign.totalRaised! / campaign.goal) * 100, 100);
  const ngo = campaign.ngo as unknown as Ngo;

  return (
    <div className="campaign-container" dir="rtl">



      {/* 1. Middle Section: Key Info & Actions */}
      <section className="info-card">
        <div className="header-row">
          <div className="title-area">
            <div className="ngo-badge">
              <img src={`${IMAGE_URL}/${ngo.logoUrl}`} alt="logo" className="ngo-logo-small" />
              {ngo.name}
            </div>
            <h1 className="campaign-title">{campaign.title}</h1>

            {/* Tags */}
            <div className="tags-container">
              {campaign.tags.map((tag, index) => (
                <span key={index} className="tag-badge">
                  <Tag size={12} style={{ marginLeft: 4 }} />
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta Data */}
            <div className="meta-data-box" style={{ marginTop: '16px' }}>
              <div className="meta-item">
                <Calendar size={16} /> <span>התחלה: {formatDate(campaign.startDate)}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} /> <span>סיום: {formatDate(campaign.endDate)}</span>
              </div>
              <div className="meta-item">
                <LinkIcon size={16} />
                <a href={CAMPAIGM_DEATAILS_URL} target="_blank" className="blockchain-link">לצפייה בפרטי הקמפיין בבלוקצ'יין - הזינו מספר {campaign.blockchainTx} בשורת החיפוש </a>
              </div>
            </div>
          </div>


        </div>
        <div>
          <div className="progress-area">
            <h3>{campaign.totalRaised!.toLocaleString()} ₪ <span style={{ fontSize: '1rem', color: '#666', fontWeight: 400 }}>מתוך {campaign.goal.toLocaleString()} ₪</span></h3>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
              <span><Users size={16} style={{ verticalAlign: 'middle' }} /> {campaign.numOfDonors} תורמים</span>
              <span>{Math.round(percent)}% מהיעד</span>
            </div>
          </div>
        </div>
        {/* Stats & Buttons Grid */}
        <div className="stats-action-container">
          {/* Left: Stats */}

          {/* Share Button (Top Left) */}
          <div style={{ alignSelf: 'flex-start' }}>
            <ShareCampaign campaign={campaign} />
          </div>

          {/* Right: Buttons */}
          <div className="buttons-area">
            <button
              className="btn-donate btn-credit"
              onClick={() => setShowCreditPay(true)}
              disabled={!isPayable()}
            >
              <CreditCard size={20} /> תרומה באשראי
            </button>

            <button
              className="btn-donate btn-crypto"
              onClick={() => setShowCryptoPay(true)}
              disabled={!isPayable()}
            >
              <Bitcoin size={20} /> תרומה בקריפטו
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Section: Visuals (Full Width) */}
      {(campaign.images.length >0 || campaign.movie)&&  <section className="media-section">
        <div className="main-stage">
          {isVideo && campaign.movie ? (
            <video src={`${IMAGE_URL}/${campaign.movie}`} controls autoPlay className="gallery-media" />
          ) : (
            <img src={`${IMAGE_URL}/${selectedMedia}`} alt="Main visual" />
          )}
        </div>

        {/* Thumbnails Row */}
        <div className="thumbnails-row">
          {campaign.movie && (
            <button
              className={`thumb-btn ${isVideo ? 'active' : ''}`}
              onClick={() => handleMediaClick(campaign.movie!, true)}
            >
              <span style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#000', color: '#fff' }}>▶️</span>
            </button>
          )}
          {campaign.images?.map((img, idx) => (
            <button
              key={idx}
              className={`thumb-btn ${selectedMedia === img && !isVideo ? 'active' : ''}`}
              onClick={() => handleMediaClick(img, false)}
            >
              <img src={`${IMAGE_URL}/${img}`} alt={`thumb ${idx}`} />
            </button>
          ))}
        </div>
      </section>}

      {/* 3. Bottom Section: Tabs & Details */}
      <section className="details-section">
        <div className="tabs-nav">
          <button
            className={`tab-link ${activeTab === "project" ? "active" : ""}`}
            onClick={() => setActiveTab("project")}
          >
            על הפרויקט
          </button>
          <button
            className={`tab-link ${activeTab === "ngo" ? "active" : ""}`}
            onClick={() => setActiveTab("ngo")}
          >
            על העמותה
          </button>
          <button
            className={`tab-link ${activeTab === "donations" ? "active" : ""}`}
            onClick={() => setActiveTab("donations")}
          >
            תרומות
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "project" && <div style={{ whiteSpace: 'pre-line' }}>{campaign.description}</div>}
          {activeTab === "ngo" && <NgoDetailsCard ngo={ngo} />}
          {activeTab === "donations" && <CampaignDonations campaignId={campaign._id!} />}
        </div>
      </section>

      {/* Modals */}
      <Modal show={showCryptoPay} onClose={() => setShowCryptoPay(false)} component={<CryptoPayment close={() => setShowCryptoPay(false)} campaignId={campaign._id!} userId={campaign.ngo} />} />
      <Modal show={showCreditPay} onClose={() => setShowCreditPay(false)} component={<CreditPayment close={() => setShowCreditPay(false)} campaignId={campaign._id!} userId={campaign.ngo} />} />

    </div>
  );
};

export default CampaignPage;