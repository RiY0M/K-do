import EditableCheckLine from "../EditableCheckLine";
import AddInput from "../../inputs/AddInput";
import { Kdo } from "../../../interfaces/Kdo";
import { createMyKdo } from "../../../services/api/kdos";

interface Props {
  listId: number;
  kdos: Kdo[];
}

export default function MyUncheckedList({
  listId,
  kdos,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    const newKdo = await createMyKdo(listId);
  };

  const handleDelete = (id: number) => {
    // TODO : handle list update
  }

  return (
    <div>
      {kdos.map((kdo) => (
        <EditableCheckLine
          key={kdo.id}
          kdo={kdo}
          onDelete={handleDelete}
        />
      ))}

      <AddInput label="Ajouter pour tous" onClick={handleAddInput} />
    </div>
  );
}
