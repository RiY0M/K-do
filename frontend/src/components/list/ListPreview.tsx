import Plus from "../../assets/svgs/Plus";
import { List } from "../../interfaces/list";
import { CSS } from "../../services/utils";
import FullAccordion from "../accordions/FullAccordion";
import IconInlineText from "../IconInlineText";
import UserLink from "../UserLink";
import MultiStateButton from "../buttons/MultiStateButton";

interface Props {
  list: List;
}

export default function ListPreview({
  list,
}: Readonly<Props>) {

  const handleAdd = async () => {
    navigator.clipboard.writeText("http://localhost/invite/userId");
  };

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
        <MultiStateButton onClick={handleAdd} validatedLabel="Copié&nbsp;!">
          <IconInlineText leftIcon={<Plus />}>
            Inviter
          </IconInlineText>
        </MultiStateButton>

        {list?.friends && list.friends.map((friend) => (
          <UserLink key={friend.id} user={friend} />
        ))}
      </div>
    </FullAccordion>
  );
}