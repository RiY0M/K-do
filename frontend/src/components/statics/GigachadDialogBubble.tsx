import { ReactNode } from "react";
import DialogBubble from "./DialogBubble";
import gigachad from "../../assets/images/Gigachad.png";

interface Props {
  reverseDirection?: boolean;
  children: ReactNode;
}

export default function GigachadDialogBubble({
  reverseDirection = false,
  children,
}: Readonly<Props>) {

  return (
    <DialogBubble
      reverseDirection={!reverseDirection}
      src={gigachad}
      alt="gigachad"
    >
      {children}
    </DialogBubble>
  )
}
