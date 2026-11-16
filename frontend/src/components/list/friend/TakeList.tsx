import { User } from "../../../interfaces/User";
import UserLink from "../../UserLink";

interface Props {
  users: User[];
}

export default function TakeList({
  users,
}: Readonly<Props>) {

  return (
    <div className="row small-gap sub-text">
      Pris par :
      {users.map((user) => (
        <UserLink key={user.id} user={user} isSubText />
      ))}
    </div>
  );
}
