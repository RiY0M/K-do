import { useRef, useState } from "react";
import TypingInput from "./TypingInput";

interface Props {
  canEdit?: boolean;
}

export default function Description({
  canEdit = true,
}: Readonly<Props>) {
  const [description, setDescription] = useState<string>("");
  const timeout = useRef<number>(0);

  const updateDescription = (newText: string) => {
    setDescription(newText);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      // updateItem(item.id, { ...item, value: newText });
    }, 500);
  }

  return (
    <TypingInput
      label="Commentaires"
      name="description"
      type="textarea"
      value={description}
      setValue={canEdit ? updateDescription : () => { }}
    />
  );
}
