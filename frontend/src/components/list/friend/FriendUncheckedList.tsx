import { Kdo } from "../../../interfaces/Kdo";
import { createFriendKdo } from "../../../services/api/kdos";
import AddInput from "../../inputs/AddInput";
import ListKdos from "../ListKdos";

interface Props {
  kdos: Kdo[];
}

export default function FriendUncheckedList({
  kdos,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    const newKdo = await createFriendKdo();
  };

  return (
    <div>
      <ListKdos kdos={kdos} />

      <AddInput label="Ajouter un cadeau libre" onClick={handleAddInput} />
    </div>
  );
}
