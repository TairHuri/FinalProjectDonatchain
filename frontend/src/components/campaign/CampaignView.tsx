import { useState } from "react";
import { cardStyle, primaryBtnStyle } from "../../css/dashboardStyles"
import type { Campaign } from "../../models/Campaign"
import AlertDialog, { useAlertDialog } from "../gui/AlertDialog";
import ConfirmDialog, { useConfirmDialog } from "../gui/ConfirmDialog";
import { toggleCampaignStatus } from "../../services/campaignApi";
import Modal from "../gui/Modal";
import ReportDialog from "./ReportDialog";

import "../../css/campaign/EditCampaign.css"

export type CampaignViewProps = {
  campaign: Campaign;
  setCampaign: (campaign: Campaign) => void;
  token: string;
  setEditMode: (mode: "view" | "edit") => void;
}
const CampaignView = ({ campaign, setCampaign, token, setEditMode }: CampaignViewProps) => {

  const IMAGE_URL = import.meta.env.VITE_IMAGES_URL || "http://localhost:4000/images";
  const { showConfirm, openConfirm, closeConfirm } = useConfirmDialog()
  const { showAlert, isFailure, message, clearAlert, setAlert } = useAlertDialog();
  const [showReportOptions, setShowReportOptions] = useState<boolean>(false);


  const handleToggle = async (id: string) => {
    try {
      const res = await toggleCampaignStatus(id, token);
      setAlert(res.message || "הסטטוס עודכן בהצלחה", false)
      setCampaign({ ...campaign!, isActive: !campaign?.isActive })
    } catch (err) {
      console.error((err as any).message);
      closeConfirm()
      setAlert((err as any).message || "שגיאה בעדכון הסטטוס", true)
    } finally {
      closeConfirm()
    }
  };
  return (
    <div className="cc-card cc-compact-media" style={cardStyle} dir="rtl">
      <h2 className="cc-title">פרטי קמפיין</h2>
      <div className="cc-section">
        <img src={`${IMAGE_URL}/${campaign.mainImage}`} alt="תמונה" className="cc-main-preview" />
        <p><strong>שם קמפיין:</strong> {campaign.title}</p>
        <p><strong>תיאור קמפיין:</strong> {campaign.description}</p>
        <p><strong>מספר בלוקצ'יין:</strong> {campaign.blockchainTx}</p>
        <p><strong>סכום יעד:</strong> {campaign.goal}</p>
        <p><strong>סכום שגויס:</strong> {campaign.raised}</p>
        <p><strong>מספר תורמים:</strong> {campaign.numOfDonors}</p>
        <p><strong>תאריך התחלה:</strong> {new Date(campaign.startDate).toLocaleDateString('he')}</p>
        <p><strong>תאריך סיום:</strong> {new Date(campaign.endDate).toLocaleDateString('he')}</p>
        <p><strong>קטגוריות:</strong> {(campaign.tags || []).join(", ") || "-"}</p>
      </div>
      <div className="campaign-edit-buttons cc-actions" style={{ gap: ".5rem", marginTop: ".8rem" }}>
        <button onClick={() => setEditMode("edit")} style={{ ...primaryBtnStyle }}>
          עריכת פרטים
        </button>
        <button style={{ ...primaryBtnStyle }} onClick={openConfirm}>
          {campaign.isActive ? 'השהייה/מחיקה' : 'הפעל'}
        </button>
        <button style={{ ...primaryBtnStyle }} onClick={() => setShowReportOptions(prev => !prev)}>
          יצירת דו״ח
        </button>
      </div>
      <Modal component={<ReportDialog campaignId={campaign._id!} token={token} close={() => setShowReportOptions(prev => !prev)} />} show={showReportOptions} />
      <ConfirmDialog
        show={showConfirm}
        onYes={() => handleToggle(campaign._id!)}
        onNo={closeConfirm}
        message={campaign.isActive ? 'פעולה זו תמחק/תשהה את הקמפיין' : 'פעולה זו תפעיל את הקמפיין'}
      />
      <AlertDialog message={message} show={showAlert} isFailure={isFailure} failureOnClose={clearAlert} successOnClose={clearAlert} />
    </div>
  )
}

export default CampaignView;