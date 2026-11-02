import { Kdo, KdoUpdate } from "../../interfaces/Kdo";
import FriendCheckLine from "./friend/FriendCheckLine";
import EditableCheckLine from "./EditableCheckLine";

interface Props {
  // Id of the user whose list this is
  listAuthorId: string;
  kdos: Kdo[];
  newKdoId?: string | null;
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

// Kdos of a friend's list: mine (surprise ideas I added) are editable, the
// others can be reserved
export default function ListKdos({
  listAuthorId,
  kdos,
  newKdoId,
  onUpdate,
  onDelete,
}: Readonly<Props>) {

  return kdos.map((kdo) => (
    kdo.authorId ?
      <EditableCheckLine
        key={kdo.id}
        kdo={kdo}
        listAuthorId={listAuthorId}
        autoFocus={kdo.id === newKdoId}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      :
      <FriendCheckLine
        key={kdo.id}
        kdo={kdo}
        listAuthorId={listAuthorId}
        onUpdate={onUpdate}
      />
  ));
}
