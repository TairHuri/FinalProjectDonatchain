import React, { useState } from "react";
import '../../css/AlertDialog.css'

type AlertDialogProps = {
  show: boolean;
  message: string;

  failureOnClose: () => void;
  failureTitle?: string;
  successOnClose?: () => void;
  successTitle?: string;
  isFailure?: boolean

};

const AlertDialog: React.FC<AlertDialogProps> = ({ show, message, failureTitle, failureOnClose, successOnClose, successTitle, isFailure = false }) => {

  if (!show) return null;

  return (
    <div className="alertBackdrop">
      <div className="alertBox" dir="rtl">
        {isFailure ? failureTitle : successTitle && (
          <div className="alertTitle">
            {isFailure ? failureTitle : successTitle}
          </div>
        )}

        <div className="alertMessage">
          {message}
        </div>

        <button className="alertButton" onClick={isFailure ? failureOnClose : successOnClose}>
          אישור
        </button>
      </div>
    </div>
  );
};

export const useAlertDialog = () => {
  const [message, setMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isFailure, setIsFailure] = useState<boolean>(false);

    return{message, setMessage, showAlert, setShowAlert, isFailure, setIsFailure}

}
export default AlertDialog;
