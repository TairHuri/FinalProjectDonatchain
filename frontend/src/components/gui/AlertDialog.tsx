import React, { useCallback, useState } from "react";
import '../../css/gui/AlertDialog.css'


/**
 * Props for the AlertDialog component.
 * - show: Controls visibility of the alert.
 * - message: Text content displayed inside the alert.
 * - failureOnClose: Callback fired when closing a failure alert.
 * - failureTitle: Optional title for failure alerts.
 * - successOnClose: Optional callback fired when closing a success alert.
 * - successTitle: Optional title for success alerts.
 * - isFailure: Determines whether the dialog represents a failure or success.
 */
type AlertDialogProps = {
  show: boolean;
  message: string;
  failureOnClose: () => void;
  failureTitle?: string;
  successOnClose?: () => void;
  successTitle?: string;
  isFailure?: boolean
};

/**
 * AlertDialog UI component to display success or failure messages.
 * Can be reused across the app with custom callbacks based on alert type.
 */
const AlertDialog: React.FC<AlertDialogProps> = ({ show, message, failureTitle, failureOnClose, successOnClose, successTitle, isFailure = false }) => {

  // Do not render anything if the alert is not visible
  if (!show) return null;

  return (
    <div className="alertBackdrop">
      <div className="alertBox" dir="rtl">

        {/* Render success or failure title if provided */}
        {isFailure ? failureTitle : successTitle && (
          <div className="alertTitle">
            {isFailure ? failureTitle : successTitle}
          </div>
        )}

        {/* Message body */}
        <div className="alertMessage">
          {message}
        </div>

        {/* Confirmation button: callback depends on failure or success */}
        <button className="alertButton" onClick={isFailure === true ? failureOnClose : successOnClose}>
          אישור
        </button>
      </div>
    </div>
  );
};

/**
 * Custom hook for managing alert dialogs.
 * Exposes methods to set messages, show alerts, and clear them.
 */
export const useAlertDialog = () => {
  const [message, setMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isFailure, setIsFailure] = useState<boolean>(false);

  /**
   * Show the alert with a message and specify if it’s a failure.
   */
  const setAlert = useCallback((message: string, isFailure: boolean) => {
    setIsFailure(isFailure);
    setMessage(message);
    setShowAlert(true);
  }, []);

  /**
   * Hide alert and clear its content.
   */
  const clearAlert = useCallback(() => {
    setShowAlert(false);
    setMessage("");
  }, []);

  return { message, setMessage, showAlert, setShowAlert, isFailure, setIsFailure, setAlert, clearAlert }
}

export default AlertDialog;
