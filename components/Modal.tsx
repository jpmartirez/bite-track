import React, { useEffect } from "react";

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

const variantIcons: Record<ModalVariant, string> = {
  success: "✓",
  danger: "!",
  warning: "⚠",
  info: "ℹ",
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
      <div className="modal-content" role="dialog" aria-modal="true">
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
