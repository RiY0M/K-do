import { CSS } from "../../services/utils";
import FullAccordion from "../accordions/FullAccordion";
import EditableCheckLine from "./EditableCheckLine";
import { Kdo } from "../../interfaces/Kdo";

interface Props {
  kdos: Kdo[];
}

export default function CheckedList({
  kdos
}: Readonly<Props>) {

  const handleDelete = (id: number) => { }

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
      gap: "var(--md-space)",
    },
  };

  return (
    <FullAccordion label="Éléments cochés" defaultOpening={true}>
      <div style={styles.div}>
        {kdos.map((kdo) => (
          <EditableCheckLine
            key={kdo.id}
            kdo={kdo}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </FullAccordion>
  );
}
