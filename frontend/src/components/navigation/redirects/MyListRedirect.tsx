import ListBulletSvg from "../../../assets/svgs/ListBulletSvg";
import { RedirectProps } from "../../../interfaces/RedirectProps";
import LinkRedirect from "./LinkRedirect";

export default function MyListRedirect({
  reverseDirection,
}: Readonly<RedirectProps>) {

  return (
    <LinkRedirect
      to="/list"
      label="Liste"
      svg={<ListBulletSvg />}
      reverseDirection={reverseDirection}
    />
  );
}
