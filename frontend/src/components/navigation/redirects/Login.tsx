import ArrowLeftEndOnRectangleSvg from "../../../assets/svgs/ArrowLeftEndOnRectangleSvg";
import { RedirectProps } from "../../../interfaces/RedirectProps";
import LinkRedirect from "./LinkRedirect";

export default function LoginRedirect({
  reverseDirection,
}: Readonly<RedirectProps>) {

  return (
    <LinkRedirect
      to="/login"
      label="Connexion"
      svg={<ArrowLeftEndOnRectangleSvg />}
      reverseDirection={reverseDirection}
    />
  );
}
