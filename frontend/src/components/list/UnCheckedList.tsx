import { CSS } from "../../services/utils";
import TaggedCheckLine from "./TaggedCheckLine";
import AddInput from "../inputs/AddInput";
import { Item } from "../../interfaces/item";
import { createItem } from "../../services/api/items";

interface Props {
  items: Item[];
}

export default function UnCheckedList({
  items,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    const newItem = await createItem(1);
  };

  const styles: CSS = {
    div: {
      gap: "var(--md-space)",
    },
  };

  return (
    <div style={styles.div}>
      {items.map((item) => (
        <TaggedCheckLine
          key={item.id}
          item={item}
        />
      ))}

      <AddInput label="Ajouter pour tous" onClick={handleAddInput} />
    </div>
  );
}
