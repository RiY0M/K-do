import { Friendship } from "../../interfaces/Friendship";
import CheckSvg from "../../assets/svgs/Check";
import XMarkSvg from "../../assets/svgs/XMarkSvg";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../statics/IconInlineText";

interface Props {
  request: Friendship;
  onAccept?: (request: Friendship) => void;
  onDelete: (request: Friendship) => void;
}

export default function FriendRequestLine({
  request,
  onAccept,
  onDelete,
}: Readonly<Props>) {

  return (
    <IconInlineText className="space-between">
      <span>{request.user.name}</span>
      <div className="row sm-gap">
        {onAccept &&
          <NoStyleButton onClick={() => onAccept(request)} title="Accepter">
            <CheckSvg />
          </NoStyleButton>
        }
        <NoStyleButton onClick={() => onDelete(request)} title={onAccept ? "Refuser" : "Annuler la demande"}>
          <XMarkSvg />
        </NoStyleButton>
      </div>
    </IconInlineText>
  );
}
