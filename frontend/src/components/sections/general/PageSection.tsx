import { ReactNode } from "react";
import { CSS, mdSectionActualWidth } from "../../../services/utils";

interface Props {
  title: string;
  children: ReactNode;
}

export default function PageSection({
  title,
  children,
}: Readonly<Props>) {

  const styles: CSS = {
    section: {
      width: mdSectionActualWidth,
    },
    mainDiv: {
      gap: "var(--xl-space)",
    },
    div: {
      justifyContent: "space-around",
      alignItems: "center",
    },
  }

  return (
    <section style={styles.section}>
      <div style={styles.mainDiv}>
        <h1>{title}</h1>
        <div className="row" style={styles.div}>{children}</div>
      </div>
    </section>
  );
}
