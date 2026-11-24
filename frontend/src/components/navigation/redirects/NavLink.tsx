import { ReactNode } from "react";
import { RedirectProps } from "../../../interfaces/RedirectProps";

interface Props extends RedirectProps {
  soloButton?: boolean;
  className?: string;
  children: ReactNode;
}

export default function NavLink({
  soloButton = false,
  children,
  className = "",
  reverseDirection = false,
}: Readonly<Props>) {

  return (
    <nav
      className={`${soloButton ?
        `flex-${reverseDirection ? "start" : "end"}`
        : ""}
        ${className}
      `}
    >
      {children}
    </nav>
  );
}
