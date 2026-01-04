import { useState } from "react";
import { CSS } from "../services/utils";
import CheckLine from "./CheckLine";
import AddInput from "./inputs/AddInput";

export default function UnCheckedList() {
  const [items, setItems] = useState<number[]>([0, 1, 2]);

  const handleAddInput = () => {
    setItems(prev => [...prev, prev.length]);
  };

  const styles: CSS = {
    div: {
      gap: "var(--md-space)",
    },
  };

  return (
    <div style={styles.div}>
      {items.map((id) => (
        <CheckLine
          key={id}
          name={`nb-${id}`}
          value="Placeholder"
        />
      ))}

      <AddInput onClick={handleAddInput} />
    </div>
  );
}
