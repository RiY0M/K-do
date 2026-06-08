import { CSS } from "../services/utils";
import FullAccordion from "./accordions/FullAccordion";
import CheckLine from "./CheckLine";
import { Item } from "../interfaces/item";

interface Props {
  items: Item[];
}

export default function CheckedList({
  items
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
      gap: "var(--md-space)",
    },
  };
  return (
    <FullAccordion label="Éléments cochés" defaultOpening={true}>
      <div style={styles.div}>
        {items.map((item) => (
          <CheckLine
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </FullAccordion>
  );
}
