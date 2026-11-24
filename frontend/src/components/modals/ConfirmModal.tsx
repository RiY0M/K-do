import { ReactNode } from "react";
import { CSS } from "../../services/utils";
import MultiStateButton from "../buttons/MultiStateButton";
import Modal from "./Modal";

interface Props {
  open: boolean;
  title: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

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
      justifyContent: "flex-end",
      flexWrap: "wrap",
    },
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      {children}

      <div style={styles.buttons} className="row sm-gap">
        <button type="button" onClick={onClose}>{cancelLabel}</button>
        <MultiStateButton onClick={handleConfirm}>
          <span className="important">{confirmLabel}</span>
        </MultiStateButton>
      </div>
    </Modal>
  );
}
