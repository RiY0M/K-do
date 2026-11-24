import HomeSvg from "../../../assets/svgs/HomeSvg";
import { RedirectProps } from "../../../interfaces/RedirectProps";
import LinkRedirect from "./LinkRedirect";

export default function HomeRedirect({
  reverseDirection,
}: Readonly<RedirectProps>) {

  return (
    <LinkRedirect
      to="/"
      label="Accueil"
      svg={<HomeSvg />}
      reverseDirection={reverseDirection}
    />
  );
}
