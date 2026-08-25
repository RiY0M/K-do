import { CSS } from "../../services/utils";
import TaggedCheckLine from "./TaggedCheckLine";
import AddInput from "../inputs/AddInput";
import { Kdo } from "../../interfaces/Kdo";
import { createKdo } from "../../services/api/kdos";

interface Props {
  listId: number;
  kdos: Kdo[];
}

export default function UnCheckedList({
  listId,
  kdos,
}: Readonly<Props>) {

  const handleAddInput = async () => {
    const newKdo = await createKdo(listId);
  };

  const styles: CSS = {
    div: {
      gap: "var(--md-space)",
    },
  };

  return (
    <div style={styles.div}>
      {kdos.map((kdo) => (
        <TaggedCheckLine
          key={kdo.id}
          kdo={kdo}
        />
      ))}

      <AddInput label="Ajouter pour tous" onClick={handleAddInput} />
    </div>
  );
}
