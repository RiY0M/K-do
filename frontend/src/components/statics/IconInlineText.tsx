import { CSSProperties, ReactNode, useLayoutEffect, useRef } from "react";

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

    // An icon follows the line's size, not the other way around: copying it
    // onto the line wrote an inline size that beat the line's classes
    // (e.g. .sub-text on VoluntaryKdo)
    if (firstChild instanceof SVGElement) return;

    // Copies the first child's size/weight onto the line (e.g. a title),
    // unless the caller set them through `style`: writing to the DOM here
    // would otherwise override them after every render
    const styles = getComputedStyle(firstChild);
    if (style?.fontSize === undefined) line.style.fontSize = styles.fontSize;
    if (style?.fontWeight === undefined) line.style.fontWeight = styles.fontWeight;
  });

  return (
    <div
      ref={lineRef}
      style={style}
      className={`align-items-center row sm-gap ${className}`}
    >
      {children}
    </div>
  );
}
