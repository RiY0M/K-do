import { CSSProperties, ReactNode, useLayoutEffect, useRef } from "react";
import { CSS } from "../services/utils";

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function IconInlineText({ children, style, className = "" }: Readonly<Props>) {

  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const firstChild = line.children[0] as HTMLElement;
    if (!firstChild) return;

    // Copies the first child's size/weight onto the line (e.g. a title),
    // unless the caller set them through `style`: writing to the DOM here
    // would otherwise override them after every render
    const styles = getComputedStyle(firstChild);
    if (style?.fontSize === undefined) line.style.fontSize = styles.fontSize;
    if (style?.fontWeight === undefined) line.style.fontWeight = styles.fontWeight;
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
    <div ref={lineRef} style={styles.line} className={className}>
      {children}
    </div>
  );
}
