import { CSS } from "../../services/utils";
import TaggedCheckLine from "./TaggedCheckLine";
import AddInput from "../inputs/AddInput";
import { Item } from "../../interfaces/item";
import { createItem } from "../../services/items";
import { Dispatch, SetStateAction } from "react";

interface Props {
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>
}

export default function UnCheckedList({
  items,
  setItems,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    const newItem = await createItem();

    setItems([...items, newItem]);
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
