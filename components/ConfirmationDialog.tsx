import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const confirmButtonVariant = variant === "danger" ? "primary" : "secondary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
    >
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            loading={loading}
            className={
              variant === "danger" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
