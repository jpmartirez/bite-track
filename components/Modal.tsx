import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ModalVariant = "success" | "danger" | "warning" | "info";

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  variant?: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel: () => void;
}

const variantIcons: Record<ModalVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5" />,
  danger: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  variant = "info",
  confirmText,
  cancelText = "Close",
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isConfirmDialog = Boolean(onConfirm && confirmText);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal-content modal-content-sm" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className={`modal-icon modal-icon-${variant}`}>
            {variantIcons[variant]}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">{description}</div>

        <div className="modal-footer">
          {isConfirmDialog ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button
                type="button"
                className={variant === "danger" ? "btn-danger" : "btn-primary"}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
