import { useRef, useState } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import XMark from "../../assets/svgs/XMark";
import Checkbox from "../inputs/Checkbox";
import InvisibleTypingInput from "../inputs/InvisibleTypingInput";
import LinkIcon from "../../assets/svgs/LinkIcon";
import { Kdo } from "../../interfaces/Kdo";
import { checkMyKdo, deleteKdo, updateKdoLabel } from "../../services/api/kdos";
import IconInlineText from "../IconInlineText";
import { CSS } from "../../services/utils";

interface Props {
  kdo: Kdo;
  onDelete: (id: number) => void;
}

export default function EditableCheckLine({
  kdo,
  onDelete,
}: Readonly<Props>) {
  const [isChecked, setIsChecked] = useState(kdo?.isChecked ?? false);
  const [text, setText] = useState<string>(kdo?.label);
  const [isFocused, setIsFocused] = useState(false);
  const timeout = useRef<number>(0);

  const updateCheck = async (checkStatus: boolean) => {
    setIsChecked(checkStatus);

    await checkMyKdo(kdo.id);
  }

  const updateText = (newText: string) => {
    setText(newText);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      updateKdoLabel(kdo.id, newText);
    }, 500);
  }

  const handleDelete = async () => {
    await deleteKdo(kdo.id);
    onDelete!(kdo.id);
  }

  // const handleLink = () => {
  //   console.log("open link modal")
  // }

  const styles: CSS = {
    isChecked: {
      textDecoration: isChecked ? "line-through" : "",
    },
    isFocused: {
      visibility: isFocused ? "visible" : "hidden"
    },
  };

  return (
    <IconInlineText style={styles.isChecked}>
      <Checkbox name={`check-${kdo?.id}`} checked={isChecked} setChecked={updateCheck} />
      <InvisibleTypingInput
        name={`kdo-${kdo?.id}`}
        value={text}
        setValue={updateText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <NoStyleButton onClick={handleDelete} style={styles.isFocused}>
        <XMark />
      </NoStyleButton>
      {/* <NoStyleButton onClick={handleLink}>
        <div><LinkIcon /></div>
      </NoStyleButton> */}
    </IconInlineText>
  );
}
