import { Link } from "react-router-dom";
import IconInlineText from "../../statics/IconInlineText";
import { ReactNode } from "react";
import { RedirectProps } from "../../../interfaces/RedirectProps";

interface Props extends RedirectProps {
  to: string;
  svg: ReactNode;
  label: string;
}

export default function LinkRedirect({
  to,
  svg,
  label,
  reverseDirection = false,
}: Readonly<Props>) {

  return (
    <Link to={to} className="italic">
      <IconInlineText className={`row${reverseDirection ? "-reverse" : ""}`}>
        {label}{svg}
      </IconInlineText>
    </Link>
  );
}
