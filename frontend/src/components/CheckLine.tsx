import { useState } from "react";
import { CSS } from "../services/utils";
import NoStyleButton from "./buttons/NoStyleButton";
import XMark from "../assets/svgs/XMark";
import Checkbox from "./inputs/Checkbox";
import NoStyleTypingInput from "./inputs/NoStyleTypingInput";
import LinkIcon from "../assets/svgs/LinkIcon";

interface Props {
  name: string;
  value: string;
  checked?: boolean
  canDelete?: boolean;
}

export default function CheckLine({
  name,
  value,
  checked = false,
  canDelete = true,
}: Readonly<Props>) {
  const [check, setCheck] = useState(checked);
  const [text, setText] = useState<string>(value);

  const handleDelete = () => {
    console.log("delete")
  }

  const handleLink = () => {
    console.log("open link modal")
  }

  const styles: CSS = {
    div: {
      flexDirection: "row",
      alignItems: "center",
      gap: "var(--sm-space)",
    },
    input: {
      width: "100%",
      textDecoration: check ? "line-through" : "initial",
    },
  };

  // TODO: Use IconInlineText
  return (
    <div style={styles.div}>
      <Checkbox name={`check-${name}`} checked={check} setChecked={setCheck} />
      <span style={styles.input}>
        <NoStyleTypingInput name={name} value={text} setValue={setText} />
      </span>

      <NoStyleButton onClick={handleLink}>
        <div><LinkIcon /></div>
      </NoStyleButton>
      {canDelete &&
        <NoStyleButton onClick={handleDelete}>
          <div><XMark /></div>
        </NoStyleButton>
      }
    </div>
  );
}
