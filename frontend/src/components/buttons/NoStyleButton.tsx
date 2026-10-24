import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { CSS } from "../../services/utils";

interface Props {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  title?: string;
}

export default function NoStyleButton({ children, onClick, onMouseDown, style, title }: Readonly<Props>) {

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
    <button
      type="button"
      style={styles.button}
      className="action"
      onClick={onClick}
      onMouseDown={onMouseDown}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}
