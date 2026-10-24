import { Friendship } from "../../interfaces/Friendship";
import { CSS } from "../../services/utils";
import Check from "../../assets/svgs/Check";
import XMark from "../../assets/svgs/XMark";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../IconInlineText";

interface Props {
  request: Friendship;
  // Only for received requests
  onAccept?: (request: Friendship) => void;
  // Declines a received request, cancels a sent one
  onDelete: (request: Friendship) => void;
}

export default function FriendRequestLine({
  request,
  onAccept,
  onDelete,
}: Readonly<Props>) {

  const styles: CSS = {
    line: {
      justifyContent: "space-between",
    },
    buttons: {
      flexDirection: "row",
      gap: "var(--sm-space)",
    },
  };

  return (
    <IconInlineText style={styles.line}>
      <span>{request.user.name}</span>
      <div style={styles.buttons}>
        {onAccept &&
          <NoStyleButton onClick={() => onAccept(request)} title="Accepter">
            <Check />
          </NoStyleButton>
        }
        <NoStyleButton onClick={() => onDelete(request)} title={onAccept ? "Refuser" : "Annuler la demande"}>
          <XMark />
        </NoStyleButton>
      </div>
    </IconInlineText>
  );
}
