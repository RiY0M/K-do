import { CSS } from "../../../services/utils";
import FullAccordion from "../../accordions/FullAccordion";
import EditableCheckLine from "../EditableCheckLine";
import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";

interface Props {
  kdos: Kdo[];
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

export default function MyCheckedList({
  kdos,
  onUpdate,
  onDelete,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
    },
  };

  return (
    <FullAccordion label="Éléments cochés" defaultOpening={true}>
      <div style={styles.div}>
        {kdos.map((kdo) => (
          <EditableCheckLine
            key={kdo.id}
            kdo={kdo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </FullAccordion>
  );
}
