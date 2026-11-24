import { MouseEventHandler, ReactNode } from "react";
import NoStyleButton from "../../buttons/NoStyleButton";
import IconInlineText from "../../statics/IconInlineText";
import { RedirectProps } from "../../../interfaces/RedirectProps";

interface Props extends RedirectProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  svg: ReactNode;
  label: string;
}

export default function NoStyleButtonRedirect({
  onClick,
  svg,
  label,
  reverseDirection = false,
}: Readonly<Props>) {

  return (
    <NoStyleButton onClick={onClick}>
      <IconInlineText className={`link italic row${reverseDirection ? "-reverse" : ""}`}>
        {label}{svg}
      </IconInlineText>
    </NoStyleButton>
  );
}
