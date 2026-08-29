import { CSSProperties, ReactNode, useLayoutEffect, useRef } from "react";
import { CSS } from "../services/utils";

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}

export default function IconInlineText({ children, style }: Readonly<Props>) {

  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const firstChild = line.children[0] as HTMLElement;
    if (!firstChild) return;

    const styles = getComputedStyle(firstChild);
    line.style.fontSize = styles.fontSize;
    line.style.fontWeight = styles.fontWeight;
  });

  const styles: CSS = {
    line: {
      flexDirection: "row",
      gap: "var(--sm-space)",
      alignItems: "center",
      ...style
    },
  }

  return (
    <div ref={lineRef} style={styles.line}>
      {children}
    </div>
  );
}
