import { ReactNode, useLayoutEffect, useRef } from "react";
import { CSS } from "../services/utils";

interface Props {
  leftIcon?: ReactNode;
  children: ReactNode;
  rightIcon?: ReactNode;
}

export default function IconInlineText({ leftIcon = "", children, rightIcon = "" }: Readonly<Props>) {

  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const firstChild = line.children[0] as HTMLElement;
    if (!firstChild) return;

    const styles = getComputedStyle(firstChild);
    line.style.fontSize = styles.fontSize;
    line.style.fontWeight = styles.fontWeight;
  }, []);

  const styles: CSS = {
    line: {
      flexDirection: "row",
      gap: "var(--sm-space)",
      alignItems: "center",
    },
  }

  return (
    <div ref={lineRef} style={styles.line}>
      {leftIcon}
      {children}
      {rightIcon}
    </div>
  );
}
