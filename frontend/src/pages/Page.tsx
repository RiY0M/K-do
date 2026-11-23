import { ReactNode } from "react";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";

type GapSpace = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  idealSectionsWidth: number;
  nbInlineSections?: number;
  gapSpace?: GapSpace;
  children: ReactNode;
}

export default function Page({
  idealSectionsWidth,
  nbInlineSections = 1,
  gapSpace = "md",
  children,
}: Readonly<Props>) {

  const behaviourDisplay = useBehaviourDisplay();
  const isLandscape = behaviourDisplay === "landscape";

  const styles: CSS = {
    page: {
      margin: "auto",
      width: isLandscape ? `calc(${idealSectionsWidth}px + var(--${gapSpace}-space) * ${nbInlineSections - 1})` : "100%",
    },
  }

  return (
    <div style={styles.page}>
      {children}
    </div>
  );
}
