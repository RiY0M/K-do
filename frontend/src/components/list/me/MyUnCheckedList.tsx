import EditableCheckLine from "../EditableCheckLine";
import SortableKdos from "../SortableKdos";
import AddInput from "../../inputs/AddInput";
import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";
import { createMyKdo } from "../../../services/api/kdos";

interface Props {
  listId: string;
  kdos: Kdo[];
  newKdoId?: string | null;
  onAdd: (kdo: Kdo) => void;
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export default function MyUncheckedList({
  listId,
  kdos,
  newKdoId,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    try {
      const newKdo = await createMyKdo(listId);
      onAdd(newKdo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <SortableKdos
        kdos={kdos}
        onReorder={onReorder}
        renderKdo={(kdo, dragHandle) => (
          <EditableCheckLine
            kdo={kdo}
            dragHandle={dragHandle}
            autoFocus={kdo.id === newKdoId}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        )}
      />

      <AddInput label="Ajouter pour tous" onClick={handleAddInput} />
    </div>
  );
}
