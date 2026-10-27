import { ReactNode } from "react";
import { CSS } from "../../services/utils";
import MultiStateButton from "../buttons/MultiStateButton";
import Modal from "./Modal";

interface Props {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  // Closes the modal once it resolves; an error is shown on the button
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

// Replaces window.confirm(): asks before an action that can't be undone
export default function ConfirmModal({
  open,
  title,
  children,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onClose,
}: Readonly<Props>) {

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const styles: CSS = {
    buttons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: "var(--sm-space)",
      flexWrap: "wrap",
    },
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {children}

      <div style={styles.buttons}>
        <button type="button" onClick={onClose}>{cancelLabel}</button>
        <MultiStateButton onClick={handleConfirm}>
          <span className="important">{confirmLabel}</span>
        </MultiStateButton>
      </div>
    </Modal>
  );
}
