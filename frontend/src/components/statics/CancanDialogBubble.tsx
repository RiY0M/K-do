import { ReactNode } from "react";
import DialogBubble from "./DialogBubble";
import fleurCancan from "../../assets/images/Fleur_cancan_jaune.webp";

interface Props {
  reverseDirection?: boolean;
  children: ReactNode;
}

export default function CancanDialogBubble({
  reverseDirection = false,
  children,
}: Readonly<Props>) {

  return (
    <DialogBubble
      reverseDirection={reverseDirection}
      src={fleurCancan}
      alt="fleur-cancan"
    >
      {children}
    </DialogBubble>
  )
}
