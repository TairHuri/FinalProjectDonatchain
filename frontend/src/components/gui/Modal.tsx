import type { ReactNode } from "react";
import "../../css/Modal.css";

const Modal = ({
  component,
  children,
  show,
  onClose,
}: {
  component?: ReactNode;
  show: boolean;
  onClose?: () => void;
  children?: ReactNode;
}) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {component || children}
      </div>
    </div>
  );
};

export default Modal;

