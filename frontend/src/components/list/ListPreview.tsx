import { List } from "../../interfaces/List";
import { CSS } from "../../services/utils";
import FullAccordion from "../accordions/FullAccordion";
import UserLink from "../UserLink";

interface Props {
  list: List;
}

export default function ListPreview({
  list,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      gap: "var(--sm-space)",
    },
  };

  return (
    <FullAccordion
      label={list.label}
      defaultOpening={true}
    >
      <div style={styles.div}>
        {list?.friends && list.friends.map((friend) => (
          <UserLink key={friend.id} user={friend} />
        ))}
      </div>
    </FullAccordion>
  );
}
