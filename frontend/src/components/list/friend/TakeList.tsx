import { CSS } from "../../../services/utils";
import { User } from "../../../interfaces/User";
import TakeListKdo from "./TakeListKdo";

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
        <TakeListKdo key={user.id} user={user} />
      ))}
    </div>
  );
}
