import { CSS } from "../services/utils";
import { User } from "../interfaces/user";
import { Link } from "react-router-dom";

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
  };

  return (
    user.isFriend ?
      <Link style={styles.link} to={`/guest/${user.id}`}>
        {user.name}
      </Link>
      :
      <span style={styles.link}>{user.name}</span>
  );
}
