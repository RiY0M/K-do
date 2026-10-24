import { useRef, useState } from "react";
import TypingInput from "./TypingInput";
import { updateListDescription } from "../../services/api/lists";

interface Props {
  id: string;
  defaultDescription: string;
}

export default function Description({
  id,
  defaultDescription,
}: Readonly<Props>) {
  const [description, setDescription] = useState<string>(defaultDescription);
  const timeout = useRef<number | undefined>(undefined);

  const updateDescription = (newText: string) => {
    setDescription(newText);
    window.clearTimeout(timeout.current);

    timeout.current = window.setTimeout(() => {
      updateListDescription(id, newText).catch(console.error);
    }, 500);
  }

  return (
    <TypingInput
      label="Commentaires"
      name="description"
      type="textarea"
      value={description}
      setValue={updateDescription}
      maxLength={2000}
      rows={4}
    />
  );
}
