import { User } from "../../interfaces/User";
import { Link } from "react-router-dom";

interface Props {
  user: User;
  isSubText?: boolean;
}

export default function UserLink({
  user,
  isSubText = false,
}: Readonly<Props>) {

  return (
    user.isFriend ?
      <Link className={isSubText ? "sub-text" : ""} to={`/friend/${user.id}`}>
        {user.name}
      </Link>
      :
      <span className={isSubText ? "sub-text" : ""}>{user.name}</span>
  );
}
