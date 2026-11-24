import { CSS } from "../../../services/utils";
import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";
import TakeList from "./TakeList";
import Checkbox from "../../inputs/Checkbox";
import IconInlineText from "../../statics/IconInlineText";
import { checkFriendKdo } from "../../../services/api/kdos";
import { getCurrentUser } from "../../../services/authStorage";
import { useState } from "react";
import NoStyleButton from "../../buttons/NoStyleButton";
import LinkSvg from "../../../assets/svgs/LinkSvg";
import LinksModal from "../../modals/LinksModal";
import VolontaryKdo from "./VoluntaryKdo";
import KdoNewsTag from "./KdoNewsTag";
// import Markdown from "../../Markdown"; // TODO markdown: put back later
import { checkLineRow, iconSlot } from "../checkLineStyles";

interface Props {
  kdo: Kdo;
  listAuthorId: string;
  onUpdate: (kdo: KdoUpdate) => void;
}

export default function FriendCheckLine({
  kdo,
  listAuthorId,
  onUpdate,
}: Readonly<Props>) {
  const user = getCurrentUser();
  const takenBy = kdo.takenBy ?? [];
  const isChecked = takenBy.some((friend) => friend.id === user?.id);
  // One of the list owner's own wishes that they checked themselves: shown
  // checked, and can't be reserved anymore
  const isCheckedByOwner = !!kdo.isChecked && kdo.author?.id === listAuthorId;
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const linkCount = kdo.links?.length ?? 0;

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
    span: {
      flex: 1,
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
    },
    isChecked: {
      ...checkLineRow,
      textDecoration: isChecked || isCheckedByOwner ? "line-through" : "",
    }
  };

  return (
    <div className="sm-gap">
      {kdo.news &&
        <KdoNewsTag news={kdo.news} />
      }
      {kdo.author && kdo.author.id !== listAuthorId &&
        <VolontaryKdo user={kdo.author!} />
      }
      {takenBy.length > 0 &&
        <TakeList users={takenBy} />
      }

      <IconInlineText style={styles.isChecked}>
        <span style={iconSlot}>
          <Checkbox
            name={`check-${kdo.id}`}
            checked={isChecked || isCheckedByOwner}
            disabled={isCheckedByOwner}
            setChecked={updateCheck}
          />
        </span>
        <span style={styles.span}>
          {kdo.label}
          {/* <Markdown text={kdo.label} /> */}
        </span>

        {linkCount > 0 &&
          <>
            <span style={iconSlot}>
              <NoStyleButton onClick={() => setIsLinksOpen(true)} title={`Liens (${linkCount})`}>
                <LinkSvg />
              </NoStyleButton>
            </span>

            <LinksModal
              kdo={kdo}
              editable={false}
              open={isLinksOpen}
              onClose={() => setIsLinksOpen(false)}
            />
          </>
        }
      </IconInlineText>
    </div>
  );
}
