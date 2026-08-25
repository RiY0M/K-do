import Plus from "../../assets/svgs/Plus";
import IconInlineText from "../IconInlineText";
import MultiStateButton from "../buttons/MultiStateButton";

interface Props {
  userId: string;
}

export default function CopyLinkButton({
  userId,
}: Readonly<Props>) {

  const handleAdd = async () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${userId}`);
  };

  return (
    <MultiStateButton onClick={handleAdd} validatedLabel="Copié&nbsp;!">
      <IconInlineText>
        <Plus />Inviter
      </IconInlineText>
    </MultiStateButton>
  );
}
