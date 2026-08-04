import { Group } from "../../interfaces/group";
import { CSS } from "../../services/utils";
import FullPreviewAccordion from "../accordions/FullPreviewAccordion";
import AddInput from "../inputs/AddInput";
import UserLink from "../UserLink";

interface Props {
  group: Group;
}

export default function GroupBody({
  group,
}: Readonly<Props>) {

  const handleAdd = () => { }

  const styles: CSS = {
    div: {
      gap: "var(--sm-space)",
    }
  };

  return (
    <FullPreviewAccordion
      label={group.label}
      preview={""}
    >
      <div style={styles.div}>
        <AddInput label="Inviter" onClick={handleAdd} />
        {group.friends.map(friend =>
          <UserLink key={friend.id} user={friend} />
        )}
      </div>
    </FullPreviewAccordion>
  );
}
