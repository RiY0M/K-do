import { useState } from "react";
import { CSS } from "../../services/utils";
import { Kdo } from "../../interfaces/Kdo";
import { User } from "../../interfaces/User";
import TakeList from "./TakeList";
import Checkbox from "../inputs/Checkbox";
import IconInlineText from "../IconInlineText";
import { checkKdo } from "../../services/api/kdos";

interface Props {
  kdo: Kdo;
}

export default function TaggedCheckLine({
  kdo,
}: Readonly<Props>) {
  const [check, setCheck] = useState(kdo?.isChecked ?? false);

  const updateCheck = async (checkStatus: boolean) => {
    setCheck(checkStatus);

    await checkKdo(kdo.id);
  }

  const styles: CSS = {
    div: {
      gap: "var(--xs-space)",
    },
  };

  return (
    <div style={styles.div}>
      {kdo.takenBy && kdo.takenBy!.length > 0 &&
        <TakeList users={kdo.takenBy!} />
      }

      <IconInlineText>
        <Checkbox name={`check-${kdo?.id}`} checked={check} setChecked={updateCheck} />
        {kdo.label}
        {/* <NoStyleButton onClick={handleLink}>
          <div><LinkIcon /></div>
        </NoStyleButton> */}
      </IconInlineText>
    </div>
  );
}
