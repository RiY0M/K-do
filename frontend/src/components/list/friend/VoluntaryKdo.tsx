import { User } from "../../../interfaces/User";
import UserLink from "../../statics/UserLink";
import IconInlineText from "../../statics/IconInlineText";
import ExclamationTriangleSvg from "../../../assets/svgs/ExclamationTriangleSvg";

interface Props {
  user: User;
}

export default function VolontaryKdo({
  user,
}: Readonly<Props>) {

  return (
    <IconInlineText className="sub-text">
      <ExclamationTriangleSvg />
      Créé par :
      <UserLink key={user.id} user={user} isSubText />
    </IconInlineText>
  );
}
