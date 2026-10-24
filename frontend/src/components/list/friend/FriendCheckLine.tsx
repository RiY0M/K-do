import { CSS } from "../../../services/utils";
import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";
import TakeList from "./TakeList";
import Checkbox from "../../inputs/Checkbox";
import IconInlineText from "../../IconInlineText";
import { checkFriendKdo } from "../../../services/api/kdos";
import { getCurrentUser } from "../../../services/authStorage";

interface Props {
  kdo: Kdo;
  onUpdate: (kdo: KdoUpdate) => void;
}

export default function FriendCheckLine({
  kdo,
  onUpdate,
}: Readonly<Props>) {
  const user = getCurrentUser();
  const takenBy = kdo.takenBy ?? [];
  const isChecked = takenBy.some((friend) => friend.id === user?.id);

  const updateCheck = async (checkStatus: boolean) => {
    if (!user) return;

    // Updated right away, then replaced by what the server says
    onUpdate({
      id: kdo.id,
      takenBy: checkStatus
        ? [...takenBy, { id: user.id, name: user.name, isFriend: false }]
        : takenBy.filter((friend) => friend.id !== user.id),
    });

    try {
      const updatedKdo = await checkFriendKdo(kdo.id, checkStatus);
      onUpdate({ id: kdo.id, takenBy: updatedKdo.takenBy ?? [] });
    } catch (error) {
      console.error(error);
      onUpdate({ id: kdo.id, takenBy: takenBy });
    }
  }

  const styles: CSS = {
    div: {
      gap: "var(--xs-space)",
    },
    isChecked: {
      textDecoration: isChecked ? "line-through" : "",
    }
  };

  return (
    <div style={styles.div}>
      {takenBy.length > 0 &&
        <TakeList users={takenBy} />
      }

      <IconInlineText style={styles.isChecked}>
        <Checkbox name={`check-${kdo.id}`} checked={isChecked} setChecked={updateCheck} />
        {kdo.label}
        {/* <NoStyleButton onClick={handleLink}>
          <div><LinkIcon /></div>
        </NoStyleButton> */}
      </IconInlineText>
    </div>
  );
}
