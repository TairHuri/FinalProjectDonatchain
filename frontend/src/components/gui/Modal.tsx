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
  // Do not render anything if the modal should be hidden
  if (!show) return null;

  return (
    // The dark backdrop behind the modal.
    // Clicking it triggers the onClose callback.
    <div className="modal-backdrop" onClick={onClose}>
      {/* The actual popup content container.
          stopPropagation() prevents closing the modal when clicking inside it */}
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Render 'component' if provided, otherwise render children */}
        {component || children}
      </div>
    </div>
  );
};

export default Modal;
