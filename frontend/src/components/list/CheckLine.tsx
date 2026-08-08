import { useRef, useState } from "react";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import XMark from "../../assets/svgs/XMark";
import Checkbox from "../inputs/Checkbox";
import NoStyleTypingInput from "../inputs/NoStyleTypingInput";
import LinkIcon from "../../assets/svgs/LinkIcon";
import { Item } from "../../interfaces/item";
import { deleteItem, updateItem } from "../../services/items";
import IconInlineText from "../IconInlineText";

interface Props {
  item: Item;
  canEdit?: boolean;
  onDelete?: (id: number) => {};
}

export default function CheckLine({
  item,
  canEdit = true,
  onDelete,
}: Readonly<Props>) {
  const [check, setCheck] = useState(item?.isChecked ?? false);
  const [text, setText] = useState<string>(item?.value);
  const [isFocused, setIsFocused] = useState(false);
  const timeout = useRef<number>(0);

  const updateText = (newText: string) => {
    setText(newText);
    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      updateItem(item.id, { ...item, value: newText });
    }, 500);
  }

  const handleDelete = () => {
    deleteItem(item.id);
    onDelete!(item.id);
  }

  const handleLink = () => {
    console.log("open link modal")
  }

  return (
    <IconInlineText>
      <Checkbox name={`check-${item?.id}`} checked={check} setChecked={setCheck} />
      <NoStyleTypingInput
        name={`value-${item?.id}`}
        value={text}
        setValue={canEdit ? updateText : () => { }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {onDelete && canEdit &&
        <NoStyleButton onClick={handleDelete} visibility={isFocused ? "visible" : "hidden"}>
          <XMark />
        </NoStyleButton>
      }
      <NoStyleButton onClick={handleLink}>
        <div><LinkIcon /></div>
      </NoStyleButton>
    </IconInlineText>
  );
}
