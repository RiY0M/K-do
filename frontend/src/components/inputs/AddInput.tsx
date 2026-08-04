import { MouseEventHandler } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import Plus from "../../assets/svgs/Plus";
import IconInlineText from "../IconInlineText";

interface Props {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function AddInput({ label, onClick }: Readonly<Props>) {

  return (
    <NoStyleButton onClick={onClick}>
      <IconInlineText leftIcon={<Plus />}>{label}</IconInlineText>
    </NoStyleButton>
  );
}
