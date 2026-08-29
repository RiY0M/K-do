import { CSS } from "../services/utils";
import { User } from "../interfaces/User";
import { Link } from "react-router-dom";

interface Props {
  user: User;
  style?: CSS,
}

export default function UserLink({
  user,
  style,
}: Readonly<Props>) {

  return (
    user.isFriend ?
      <Link style={style?.link} to={`/friend/${user.id}`}>
        {user.name}
      </Link>
      :
      <span style={style?.span}>{user.name}</span>
  );
}
