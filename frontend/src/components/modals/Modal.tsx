import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import XMark from "../../assets/svgs/XMark";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../IconInlineText";

interface Props {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

// Native <dialog>: closes with Escape, the cross or a click outside. Rendered
// in <body> so it doesn't inherit the styles of the line that opens it
// (strikethrough of checked Kdos...).
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
    header: {
      justifyContent: "space-between",
    },
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
          <IconInlineText style={styles.header}>
            <h2 style={styles.title}>{title}</h2>
            <NoStyleButton onClick={onClose} title="Fermer">
              <XMark />
            </NoStyleButton>
          </IconInlineText>

          {children}
        </div>
      </section>
    </dialog>,
    document.body
  );
}
