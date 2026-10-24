import { List } from "../../interfaces/List";
import { CSS } from "../../services/utils";
import FullAccordion from "../accordions/FullAccordion";
import CopyLinkButton from "../buttons/CopyLinkButton";
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
    empty: {
      fontSize: "var(--sm-size)",
    },
  };

  return (
    <FullAccordion
      label={list.label}
      defaultOpening={true}
    >
      <div style={styles.div}>
        <CopyLinkButton listId={list.id} />
        {list.friends && list.friends.map((friend) => (
          <UserLink key={friend.id} user={friend} />
        ))}
        {!list.friends?.length &&
          <span style={styles.empty}>Invitez vos proches pour partager cette liste avec eux.</span>
        }
      </div>
    </FullAccordion>
  );
}
