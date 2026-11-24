import UserSvg from "../../../assets/svgs/UserSvg";
import { RedirectProps } from "../../../interfaces/RedirectProps";
import LinkRedirect from "./LinkRedirect";

export default function AccountRedirect({
  reverseDirection,
}: Readonly<RedirectProps>) {

  return (
    <LinkRedirect
      to="/account"
      label="Compte"
      svg={<UserSvg />}
      reverseDirection={reverseDirection}
    />
  );
}
