import { CSSProperties, ReactNode, useEffect } from "react";
import { CSS, GapSpaceType } from "../services/utils";
import { useDisplay } from "../hooks/useDisplay";

interface Props {
  title: string;
  idealWidthLandscape: number;
  idealWidthPortrait: number;
  nbInlineSections?: number;
  gapSpace?: GapSpaceType;
  style?: CSSProperties;
  children: ReactNode;
}

export default function Page({
  title,
  idealWidthLandscape,
  idealWidthPortrait,
  nbInlineSections = 1,
  gapSpace = "md",
  style,
  children,
}: Readonly<Props>) {

  const { isLandscape } = useDisplay();

  useEffect(() => {
    document.title = `${title} | ${__APP_NAME__}`;
  }, [title]);

  const styles: CSS = {
    page: {
      margin: "auto",
      width: isLandscape ?
        `calc(${idealWidthLandscape}px + var(--${gapSpace}-space) * ${nbInlineSections - 1})`
        : `min(${idealWidthPortrait}px, 100%)`,
      ...style,
    },
  }

  return (
    <div style={styles.page}>
      {children}
    </div>
  );
}
