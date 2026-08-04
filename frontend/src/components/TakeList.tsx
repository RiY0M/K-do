import { CSS } from "../services/utils";
import { User } from "../interfaces/user";
import TakeListItem from "./TakeListItem";

interface Props {
  users: User[];
}

export default function TakeList({
  users,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      flexDirection: "row",
      gap: "var(--sm-space)",
      fontSize: "var(--sm-size)",
    },
    link: {
      fontSize: "var(--sm-size)",
    },
  };

  return (
    <div style={styles.div}>
      Pris par :
      {users.map((user) => (
        <TakeListItem key={user.id} user={user} />
      ))}
    </div>
  );
}
