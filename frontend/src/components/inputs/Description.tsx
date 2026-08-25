import { useRef, useState } from "react";
import TypingInput from "./TypingInput";
import { updateListDescription } from "../../services/api/lists";

interface Props {
  id: number;
  defaultDescription: string;
}

export default function Description({
  id,
  defaultDescription,
}: Readonly<Props>) {
  const [description, setDescription] = useState<string>(defaultDescription);
  const timeout = useRef<number>(0);

  const updateDescription = (newText: string) => {
    setDescription(newText);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      await updateListDescription(id, newText);
    }, 500);
  }

  return (
    <TypingInput
      label="Commentaires"
      name="description"
      type="textarea"
      value={description}
      setValue={updateDescription}
    />
  );
}
