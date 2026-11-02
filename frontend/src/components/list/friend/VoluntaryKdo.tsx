import { CSS } from "../../../services/utils";
import { User } from "../../../interfaces/User";
import UserLinkSm from "../../UserLinkSm";
import IconInlineText from "../../IconInlineText";
import ExclamationTriangle from "../../../assets/svgs/ExclamationTriangle";

interface Props {
  user: User;
}

export default function VolontaryKdo({
  user,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      fontSize: "var(--sm-size)",
    },
  };

  return (
    <IconInlineText style={styles.div}>
      <ExclamationTriangle />
      Créé par :
      <UserLinkSm key={user.id} user={user} />
    </IconInlineText>
  );
}
