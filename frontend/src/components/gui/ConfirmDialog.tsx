import React, { useState } from "react";
import '../../css/AlertDialog.css'

/**
 * Props for the confirmation dialog component.
 */
type AlertDialogProps = {
  show: boolean;     // Whether the dialog should be visible or not
  message: string;   // The message displayed in the dialog (confirmation text)

  onYes: () => void; // Callback triggered when user confirms
  onNo: () => void;  // Callback triggered when user cancels
};

/**
 * Confirmation dialog UI component.
 * Appears when `show` is true and allows user to confirm or cancel an action.
 */
const ConfirmDialog: React.FC<AlertDialogProps> = ({ show, message, onYes, onNo }) => {

  // If dialog is not visible, don't render anything
  if (!show) return null;

  return (
    <div className="alertBackdrop">
      <div className="alertBox" dir="rtl">
        {/* Dialog message */}
        <div className="alertMessage">
          {message}
        </div>

        {/* Confirmation buttons */}
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

/**
 * Custom React hook for controlling confirmation dialog visibility.
 * Provides functions to open and close the dialog.
 */
export const useConfirmDialog = () => {

  const [showConfirm, setShowConfirm] = useState<boolean>(false); // Tracks dialog visibility state

  /** Opens the confirmation dialog */
  const openConfirm = () => setShowConfirm(prev => true);

  /** Closes the confirmation dialog */
  const closeConfirm = () => setShowConfirm(prev => false);

  return { showConfirm, openConfirm, closeConfirm }
}

export default ConfirmDialog;
