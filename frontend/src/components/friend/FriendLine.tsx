import { User } from "../../interfaces/User";
import { CSS } from "../../services/utils";
import XMark from "../../assets/svgs/XMark";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../IconInlineText";
import UserLink from "../UserLink";

interface Props {
  friend: User;
  onRemove: (friend: User) => void;
}

export default function FriendLine({
  friend,
  onRemove,
}: Readonly<Props>) {

  const styles: CSS = {
    line: {
      justifyContent: "space-between",
    },
  };

  return (
    <IconInlineText style={styles.line}>
      <UserLink user={friend} />
      <NoStyleButton onClick={() => onRemove(friend)} title={`Retirer ${friend.name} de mes amis`}>
        <XMark />
      </NoStyleButton>
    </IconInlineText>
  );
}
