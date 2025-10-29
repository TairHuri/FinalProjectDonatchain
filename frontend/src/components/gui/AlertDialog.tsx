import React from "react";
import '../../css/AlertDialog.css'

type AlertDialogProps = {
  show: boolean;
  message: string;
  onClose: () => void;
  title?: string;
};

const AlertDialog: React.FC<AlertDialogProps> = ({ show, message, onClose, title }) => {
  if (!show) return null;

  return (
    <div className="alertBackdrop">
      <div className="alertBox" dir="rtl">
        {title && (
          <div className="alertTitle">
            {title}
          </div>
        )}

        <div className="alertMessage">
          {message}
        </div>

        <button className="alertButton" onClick={onClose}>
          אישור
        </button>
      </div>
    </div>
  );
};

export default AlertDialog;
