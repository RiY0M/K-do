import { ReactNode } from "react";
import { SvgProps } from "../../interfaces/SvgProps";

interface Props extends SvgProps {
  fill?: boolean;
  children: ReactNode;
}

export default function Svg({
  fill = false,
  size = "1em",
  children,
}: Readonly<Props>) {

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ? "currentColor" : "none"}
      strokeWidth={fill ? 0 : 1.5}
      stroke={fill ? "none" : "currentColor"}
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      {children}
    </svg>
  );
}
