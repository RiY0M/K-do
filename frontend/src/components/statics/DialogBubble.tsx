import { ReactNode } from "react";
import { CSS } from "../../services/utils";

interface Props {
  reverseDirection?: boolean;
  src: string;
  alt: string;
  children: ReactNode;
}

export default function DialogBubble({
  reverseDirection = false,
  src,
  alt,
  children,
}: Readonly<Props>) {

  const space = "var(--sm-space)";

  const styles: CSS = {
    bubble: {
      alignItems: "end",
    },
    span: {
      borderRadius: "100%",
      background: `linear-gradient(
          var(--gradient-angle),
          var(--color) 10%,
          var(--action) 90%,
          var(--action-hover)
        )`,
      padding: `calc(${space}/1.5)`,
      height: `calc(var(--line-height) + 2*${space})`,
      aspectRatio: "1/1",
      justifyContent: "center",
    },
    section: {
      padding: space,
    }
  }

  return (
    <div style={styles.bubble} className={`row${reverseDirection ? "-reverse" : ""} sm-gap`}>
      <span className="align-items-center flex" style={styles.span}>
        <img src={src} alt={alt} />
      </span>
      <section style={styles.section}>
        {children}
      </section>
    </div>
  )
}
