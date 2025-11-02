import React, { useState } from "react";
import '../../css/AlertDialog.css'

type AlertDialogProps = {
  show: boolean;
  message: string;

  onYes: () => void;
  onNo: () => void;
};

const ConfirmDialog: React.FC<AlertDialogProps> = ({ show, message, onYes, onNo }) => {

  if (!show) return null;

  return (
    <div className="alertBackdrop">
      <div className="alertBox" dir="rtl">
        <div className="alertMessage">
          {message}
        </div>
        <div className='confirm-buttons'>
          <button className="alertButton" onClick={onYes}>
            אישור
          </button>

          <button className="alertButton-no" onClick={onNo}>
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
};

export const useConfirmDialog = () => {

  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const openConfirm = () => setShowConfirm(prev => true)
  const closeConfirm = () => setShowConfirm(prev => false)
  return { showConfirm, openConfirm, closeConfirm }

}
export default ConfirmDialog;
