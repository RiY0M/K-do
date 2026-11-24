import { List } from "../../interfaces/List";
import FullAccordion from "../accordions/FullAccordion";
import CopyLinkButton from "../buttons/CopyLinkButton";
import UserLink from "../statics/UserLink";

interface Props {
  list: List;
}

export default function ListPreview({
  list,
}: Readonly<Props>) {

  return (
    <FullAccordion
      label={list.label}
      defaultOpening={true}
    >
      <div className="sm-gap">
        <CopyLinkButton listId={list.id} />
        {list.friends && list.friends.map((friend) => (
          <UserLink key={friend.id} user={friend} />
        ))}
        {!list.friends?.length &&
          <span className="sub-text">Invitez vos proches pour partager cette liste avec eux.</span>
        }
      </div>
    </FullAccordion>
  );
}
