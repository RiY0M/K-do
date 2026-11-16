import { CSS } from "../../../services/utils";
import FullAccordion from "../../accordions/FullAccordion";
import EditableCheckLine from "../EditableCheckLine";
import SortableKdos from "../SortableKdos";
import CheckedItemsMenu from "../CheckedItemsMenu";
import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";

interface Props {
  kdos: Kdo[];
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export default function MyCheckedList({
  kdos,
  onUpdate,
  onDelete,
  onReorder,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
    },
  };

  return (
    <FullAccordion
      label="Éléments cochés"
      defaultOpening={true}
      // My own list: every checked Kdo is mine
      leading={<CheckedItemsMenu kdos={kdos} onUpdate={onUpdate} onDelete={onDelete} />}
    >
      <div style={styles.div}>
        <SortableKdos
          kdos={kdos}
          onReorder={onReorder}
          renderKdo={(kdo, dragHandle) => (
            <EditableCheckLine
              kdo={kdo}
              dragHandle={dragHandle}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          )}
        />
      </div>
    </FullAccordion>
  );
}
