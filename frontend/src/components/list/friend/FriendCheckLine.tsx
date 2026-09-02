import { useState } from "react";
import { CSS } from "../../../services/utils";
import { Kdo } from "../../../interfaces/Kdo";
import TakeList from "./TakeList";
import Checkbox from "../../inputs/Checkbox";
import IconInlineText from "../../IconInlineText";
import { checkFriendKdo } from "../../../services/api/kdos";
import { User } from "../../../interfaces/User";
import { getCurrentUser } from "../../../services/authStorage";

interface Props {
  kdo: Kdo;
}

export default function FriendCheckLine({
  kdo,
}: Readonly<Props>) {
  const user = getCurrentUser();

  const [isChecked, setIsChecked] = useState(
    kdo?.takenBy && kdo.takenBy.filter(
      (friend: User) => friend.id == user!.id
    ).length > 0
  );

  const updateCheck = async (checkStatus: boolean) => {
    setIsChecked(checkStatus);

    await checkFriendKdo(kdo.id, checkStatus);
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
      {kdo.takenBy && kdo.takenBy!.length > 0 &&
        <TakeList users={kdo.takenBy!} />
      }

      <IconInlineText style={styles.isChecked}>
        <Checkbox name={`check-${kdo?.id}`} checked={isChecked} setChecked={updateCheck} />
        {kdo.label}
        {/* <NoStyleButton onClick={handleLink}>
          <div><LinkIcon /></div>
        </NoStyleButton> */}
      </IconInlineText>
    </div>
  );
}
