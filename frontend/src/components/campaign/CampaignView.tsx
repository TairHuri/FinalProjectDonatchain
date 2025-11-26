import { useState } from "react";
import { cardStyle, primaryBtnStyle } from "../../css/dashboardStyles"
import type { Campaign } from "../../models/Campaign"
import AlertDialog, { useAlertDialog } from "../gui/AlertDialog";
import ConfirmDialog, { useConfirmDialog } from "../gui/ConfirmDialog";
import { toggleCampaignStatus } from "../../services/campaignApi";
import Modal from "../gui/Modal";
import ReportDialog from "./ReportDialog";

import "../../css/campaign/EditCampaign.css"
import { toggleCryptoCampaignStatus } from "../../services/cryptoApi";
import Spinner, { useSpinner } from "../Spinner";

export type CampaignViewProps = {
  campaign: Campaign;
  setCampaign: (campaign: Campaign) => void;
  token: string;
  setEditMode: (mode: "view" | "edit") => void;
}

const CampaignView = ({ campaign, setCampaign, token, setEditMode }: CampaignViewProps) => {
// Image base URL from environment variables (fallback for local development)
  const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
 // Hooks for confirmation modal controls
  const { showConfirm, openConfirm, closeConfirm } = useConfirmDialog()
  // Hooks for alert dialog (success / error feedback)
  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();
  // State for toggling report modal
  const [showReportOptions, setShowReportOptions] = useState<boolean>(false);
  // Loading spinner state while processing status change
  const {start, stop, isLoading} = useSpinner()


  /**
   * Handles campaign activation/deactivation (both blockchain and database).
   * Steps:
   * 1. Close confirmation dialog
   * 2. Start loading spinner
   * 3. First update the blockchain status
   * 4. Only if blockchain update succeeded, update backend DB
   * 5. Update UI state & show alerts
   */
  const handleToggle = async (id: string) => {
    try {
      closeConfirm()
      start()
      // Blockchain status update request
      const result = await toggleCryptoCampaignStatus({blockchainTx: +campaign.blockchainTx!, newActive:!campaign?.isActive})
     // If blockchain update failed → stop process & alert user
      if(result.status == false){
        setAlert(result.message || "עדכון הסטטוס נכשל", false);
        return;
      }
      // Backend campaign status update
      const res = await toggleCampaignStatus(id, token);
      setAlert(res.message || "הסטטוס עודכן בהצלחה", false);
      // Update component state
      setCampaign({ ...campaign!, isActive: !campaign?.isActive })
    } catch (err) {
      // General error handling
      console.error((err as any).message, err);
      setAlert((err as any).message || "שגיאה בעדכון הסטטוס", true)
    } finally {
      stop()
    }
  };


  if (isLoading) return (<Spinner />);
  return (
    <div className="cc-card cc-compact-media" style={cardStyle} dir="rtl">
      <h2 className="cc-title">פרטי קמפיין</h2>
      <div className="cc-section">
        <img src={`${IMAGE_URL}/${campaign.mainImage}`} alt="תמונה" className="cc-main-preview" />
         {/* Campaign textual details */}
        <p><strong>שם קמפיין:</strong> {campaign.title}</p>
        <p><strong>תיאור קמפיין:</strong> {campaign.description}</p>
        <p><strong>מספר בלוקצ'יין:</strong> {campaign.blockchainTx}</p>
        <p><strong>סכום יעד:</strong> {campaign.goal}</p>
        <p><strong>סכום שגויס:</strong> {campaign.totalRaised}</p>
        <p><strong>סכום שגויס בקריפטו:</strong> {campaign.raised.crypto}</p>
        <p><strong>סכום שגויס באשראי:</strong> {campaign.raised.credit}</p>
        <p><strong>מספר תורמים:</strong> {campaign.numOfDonors}</p>
        <p><strong>תאריך התחלה:</strong> {new Date(campaign.startDate).toLocaleDateString('he')}</p>
        <p><strong>תאריך סיום:</strong> {new Date(campaign.endDate).toLocaleDateString('he')}</p>
        <p><strong>קטגוריות:</strong> {(campaign.tags || []).join(", ") || "-"}</p>
      </div>
      <div className="campaign-edit-buttons cc-actions" style={{ gap: ".5rem", marginTop: ".8rem" }}>
       
        <button onClick={() => setEditMode("edit")} style={{ ...primaryBtnStyle }}>
          עריכת פרטים
        </button>
       {/* Toggle active status (activate / suspend) */}
        <button style={{ ...primaryBtnStyle }} onClick={openConfirm}>
          {campaign.isActive ? 'השהייה/מחיקה' : 'הפעל'}
        </button>
         {/* Open report modal */}
        <button style={{ ...primaryBtnStyle }} onClick={() => setShowReportOptions(prev => !prev)}>
          יצירת דו״ח
        </button>
      </div>
      {/* Report modal */}
      <Modal component={<ReportDialog campaignId={campaign._id!} token={token} close={() => setShowReportOptions(prev => !prev)} />} show={showReportOptions} />
      {/* Confirmation dialog for status change */}
      <ConfirmDialog
        show={showConfirm}
        onYes={() => handleToggle(campaign._id!)}
        onNo={closeConfirm}
        message={campaign.isActive ? 'פעולה זו תמחק/תשהה את הקמפיין' : 'פעולה זו תפעיל את הקמפיין'}
      />
      {/* Global alert dialog (success or error feedback) */}
      <AlertDialog message={message} show={showAlert} isFailure={isFailure} failureOnClose={clearAlert} successOnClose={clearAlert} />
    </div>
  )
}

export default CampaignView;