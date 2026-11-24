import { MouseEventHandler } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import PlusSvg from "../../assets/svgs/PlusSvg";
import IconInlineText from "../statics/IconInlineText";

interface Props {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function AddInput({ label, onClick }: Readonly<Props>) {

  return (
    <NoStyleButton onClick={onClick}>
      <IconInlineText><PlusSvg />{label}</IconInlineText>
    </NoStyleButton>
  );
}
