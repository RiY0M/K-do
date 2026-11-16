import { User } from "../../../interfaces/User";
import UserLink from "../../UserLink";
import IconInlineText from "../../IconInlineText";
import ExclamationTriangle from "../../../assets/svgs/ExclamationTriangle";

interface Props {
  user: User;
}

export default function VolontaryKdo({
  user,
}: Readonly<Props>) {

  return (
    <IconInlineText className="sub-text">
      <ExclamationTriangle />
      Créé par :
      <UserLink key={user.id} user={user} isSubText />
    </IconInlineText>
  );
}
