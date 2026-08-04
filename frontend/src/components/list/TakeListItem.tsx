import { CSS } from "../../services/utils";
import { User } from "../../interfaces/user";
import UserLink from "../UserLink";

interface Props {
  user: User;
}

export default function TakeListItem({
  user,
}: Readonly<Props>) {

  const styles: CSS = {
    link: {
      fontSize: "var(--sm-size)",
    },
    span: {
      fontSize: "var(--sm-size)",
    },
  };

  return (
    <UserLink user={user} style={styles} />
  );
}
