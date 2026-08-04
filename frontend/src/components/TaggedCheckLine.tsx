import { CSS } from "../services/utils";
import { Item } from "../interfaces/item";
import { User } from "../interfaces/user";
import TakeList from "./TakeList";
import CheckLine from "./CheckLine";

interface Props {
  item: Item;
  users?: User[];
  canEdit?: boolean;
  onDelete?: (id: number) => {};
}

export default function TaggedCheckLine({
  item,
  users = [],
  canEdit = true,
  onDelete,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      gap: "var(--xs-space)",
    },
  };

  // TODO: Use IconInlineText
  return (
    <div style={styles.div}>
      {users.length > 0 &&
        <TakeList users={users} />
      }

      <CheckLine
        item={item}
        canEdit={canEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
