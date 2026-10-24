import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";
import { createFriendKdo } from "../../../services/api/kdos";
import AddInput from "../../inputs/AddInput";
import ListKdos from "../ListKdos";

interface Props {
  friendId: string;
  kdos: Kdo[];
  newKdoId?: string | null;
  onAdd: (kdo: Kdo) => void;
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

export default function FriendUncheckedList({
  friendId,
  kdos,
  newKdoId,
  onAdd,
  onUpdate,
  onDelete,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    try {
      const newKdo = await createFriendKdo(friendId);
      onAdd(newKdo);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ListKdos kdos={kdos} newKdoId={newKdoId} onUpdate={onUpdate} onDelete={onDelete} />

      <AddInput label="Ajouter un cadeau libre" onClick={handleAddInput} />
    </div>
  );
}
