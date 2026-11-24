import { ReactNode } from "react";
import { CSS } from "../../services/utils";
import { useDisplay } from "../../hooks/useDisplay";

interface Props {
  reverseOnChangeDirection?: boolean;
  children: ReactNode;
}

export default function InlineSections({
  reverseOnChangeDirection = false,
  children,
}: Readonly<Props>) {

  const { isLandscape } = useDisplay();

  const styles: CSS = {
    div: {
      alignItems: isLandscape ? "stretch" : "center",
    },
  }

  return (
    <div
      className={isLandscape ?
        `row${reverseOnChangeDirection ? "-reverse" : ""}`
        : ""}
      style={styles.div}
    >
      {children}
    </div>
  )
}
