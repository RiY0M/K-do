import { ReactNode, useEffect } from "react";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";

type GapSpace = "xs" | "sm" | "md" | "lg" | "xl";

interface Props {
  title: string;
  idealSectionsWidth: number;
  nbInlineSections?: number;
  gapSpace?: GapSpace;
  children: ReactNode;
}

export default function Page({
  title,
  idealSectionsWidth,
  nbInlineSections = 1,
  gapSpace = "md",
  children,
}: Readonly<Props>) {

  const behaviourDisplay = useBehaviourDisplay();
  const isLandscape = behaviourDisplay === "landscape";

  useEffect(() => {
    document.title = `${title} | ${__APP_NAME__}`;
  }, [title]);

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
