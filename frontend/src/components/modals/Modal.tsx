import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import XMarkSvg from "../../assets/svgs/XMarkSvg";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../statics/IconInlineText";

interface Props {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({
  open,
  title,
  onClose,
  children,
}: Readonly<Props>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const styles: CSS = {
    title: {
      fontSize: "var(--lg-size)",
      overflowWrap: "anywhere",
    },
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // The dialog itself is only reached by clicking on its backdrop
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section>
        <div>
          <IconInlineText className="space-between">
            <h2 style={styles.title}>{title}</h2>
            <NoStyleButton onClick={onClose} title="Fermer">
              <XMarkSvg />
            </NoStyleButton>
          </IconInlineText>

          {children}
        </div>
      </section>
    </dialog>,
    document.body
  );
}
