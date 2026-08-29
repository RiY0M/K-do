import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { CSS } from "../../services/utils";

interface Props {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}

export default function NoStyleButton({ children, onClick, style }: Readonly<Props>) {

  const styles: CSS = {
    button: {
      padding: "0",
      background: "transparent",
      boxShadow: "none",
      border: "none",
      textAlign: "left",
      ...style
    },
  }

  return (
    <button style={styles.button} className="action" onClick={onClick}>{children}</button>
  );
}
