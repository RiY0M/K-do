import { ReactNode } from "react";
import { CSS } from "../../services/utils";

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
      transform: "scale(1.5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--xl-space)",
      alignItems: "center",
    },
    div: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
  }

  return (
    <section style={styles.section}>
      <h1>{title}</h1>
      <div style={styles.div}>{children}</div>
    </section>
  );
}
