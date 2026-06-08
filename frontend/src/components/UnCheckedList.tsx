import { CSS } from "../services/utils";
import CheckLine from "./CheckLine";
import AddInput from "./inputs/AddInput";
import { Item } from "../interfaces/item";
import { createItem } from "../services/items";

interface Props {
  items: Item[];
}

export default function UnCheckedList({
  items
}: Readonly<Props>) {

  const handleAddInput = async () => {
    const newItem = await createItem();

    // setItems(prev => [...prev, newItem]);
  };

  const styles: CSS = {
    div: {
      gap: "var(--md-space)",
    },
  };

  return (
    <div style={styles.div}>
      {items.map((item) => (
        <CheckLine
          key={item.id}
          item={item}
        />
      ))}

      <AddInput onClick={handleAddInput} />
    </div>
  );
}
