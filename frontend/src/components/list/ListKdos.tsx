import { Kdo } from "../../interfaces/Kdo";
import FriendCheckLine from "./friend/FriendCheckLine";
import EditableCheckLine from "./EditableCheckLine";

interface Props {
  kdos: Kdo[];
}

export default function ListKdos({
  kdos,
}: Readonly<Props>) {

  const handleDelete = (id: number) => {
    // TODO : handle list update
  }

  return kdos.map((kdo) => (
    kdo?.authorId ?
      <EditableCheckLine
        key={kdo.id}
        kdo={kdo}
        onDelete={handleDelete}
      />
      :
      <FriendCheckLine
        key={kdo.id}
        kdo={kdo}
      />
  ));
}
