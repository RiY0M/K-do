import { useRef, useState } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import XMark from "../../assets/svgs/XMark";
import Checkbox from "../inputs/Checkbox";
import InvisibleTypingInput from "../inputs/InvisibleTypingInput";
import LinkIcon from "../../assets/svgs/LinkIcon";
import { Kdo } from "../../interfaces/Kdo";
import { checkKdo, deleteKdo, updateKdoLabel } from "../../services/api/kdos";
import IconInlineText from "../IconInlineText";

interface Props {
  kdo: Kdo;
  onDelete: (id: number) => void;
}

export default function EditableCheckLine({
  kdo,
  onDelete,
}: Readonly<Props>) {
  const [check, setCheck] = useState(kdo?.isChecked ?? false);
  const [text, setText] = useState<string>(kdo?.label);
  const [isFocused, setIsFocused] = useState(false);
  const timeout = useRef<number>(0);

  const updateCheck = async (checkStatus: boolean) => {
    setCheck(checkStatus);

    await checkKdo(kdo.id);
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

  return (
    <IconInlineText>
      <Checkbox name={`check-${kdo?.id}`} checked={check} setChecked={updateCheck} />
      <InvisibleTypingInput
        name={`kdo-${kdo?.id}`}
        value={text}
        setValue={updateText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <NoStyleButton onClick={handleDelete} visibility={isFocused ? "visible" : "hidden"}>
        <XMark />
      </NoStyleButton>
      {/* <NoStyleButton onClick={handleLink}>
        <div><LinkIcon /></div>
      </NoStyleButton> */}
    </IconInlineText>
  );
}
