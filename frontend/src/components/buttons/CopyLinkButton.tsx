import Plus from "../../assets/svgs/Plus";
import IconInlineText from "../IconInlineText";
import MultiStateButton from "../buttons/MultiStateButton";
import { createInvitation, getInvitationLink } from "../../services/api/invitations";

interface Props {
  listId: string;
}

// Copies an invitation link (/invite/:id) to the given list. Whoever opens
// it and accepts becomes your friend.
export default function CopyLinkButton({
  listId,
}: Readonly<Props>) {

  const handleAdd = async () => {
    const link = getInvitationLink(await createInvitation(listId));

    // The clipboard API only exists on https:// or localhost
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link);
    } else {
      window.prompt("Copiez ce lien d'invitation :", link);
    }
  };

  return (
    <MultiStateButton onClick={handleAdd} validatedLabel="Copié&nbsp;!">
      <IconInlineText>
        <Plus />Inviter
      </IconInlineText>
    </MultiStateButton>
  );
}
