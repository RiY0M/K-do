import { MouseEventHandler } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import Plus from "../../assets/svgs/Plus";
import IconInlineText from "../IconInlineText";

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function AddInput({ onClick }: Readonly<Props>) {

  return (
    <NoStyleButton onClick={onClick}>
      <IconInlineText leftIcon={<Plus />}>Ajouter un élément</IconInlineText>
    </NoStyleButton>
  );
}
