import { MouseEventHandler, ReactNode } from "react";
import { CSS } from "../../services/utils";

interface Props {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function NoStyleButton({ children, onClick }: Readonly<Props>) {

  const styles: CSS = {
    button: {
      padding: "0",
      background: "transparent",
      boxShadow: "none",
      border: "none",
      textAlign: "left",
    },
  }

  return (
    <button style={styles.button} className="action" onClick={onClick}>{children}</button>
  );
}
