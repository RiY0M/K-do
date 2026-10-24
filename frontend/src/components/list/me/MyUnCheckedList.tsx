import EditableCheckLine from "../EditableCheckLine";
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
}

export default function MyUncheckedList({
  listId,
  kdos,
  newKdoId,
  onAdd,
  onUpdate,
  onDelete,
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
      {kdos.map((kdo) => (
        <EditableCheckLine
          key={kdo.id}
          kdo={kdo}
          autoFocus={kdo.id === newKdoId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      <AddInput label="Ajouter pour tous" onClick={handleAddInput} />
    </div>
  );
}
