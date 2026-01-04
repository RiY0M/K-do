import { useState } from "react";
import { CSS } from "../services/utils";
import FullAccordion from "./accordions/FullAccordion";
import CheckLine from "./CheckLine";

export default function CheckedList() {

  const [items, setItems] = useState<number[]>([0, 1, 2]);

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
      gap: "var(--md-space)",
    },
  };
  return (
    <FullAccordion label="Éléments cochés" defaultOpening={true}>
      <div style={styles.div}>
        {items.map((id) => (
          <CheckLine
            key={id}
            name={`nb-${id}`}
            value="Placeholder"
            checked
          />
        ))}
      </div>
    </FullAccordion>
  );
}
