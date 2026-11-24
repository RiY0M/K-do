import { ReactNode, useRef, useState } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import XMarkSvg from "../../assets/svgs/XMarkSvg";
import Checkbox from "../inputs/Checkbox";
import InvisibleTypingInput from "../inputs/InvisibleTypingInput";
import { Kdo, KdoUpdate } from "../../interfaces/Kdo";
import { checkMyKdo, deleteKdo, updateKdoLabel } from "../../services/api/kdos";
import IconInlineText from "../statics/IconInlineText";
import LinkSvg from "../../assets/svgs/LinkSvg";
import LinksModal from "../modals/LinksModal";
import { CSS } from "../../services/utils";
import VolontaryKdo from "./friend/VoluntaryKdo";
// import Markdown from "../Markdown"; // TODO markdown: put back later
import { checkLineRow, iconSlot } from "./checkLineStyles";

interface Props {
  kdo: Kdo;
  listAuthorId?: string;
  dragHandle?: ReactNode;
  autoFocus?: boolean;
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

export default function EditableCheckLine({
  kdo,
  listAuthorId = "",
  dragHandle,
  autoFocus = false,
  onUpdate,
  onDelete,
}: Readonly<Props>) {
  const [isFocused, setIsFocused] = useState(autoFocus);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  const isChecked = kdo.isChecked ?? false;
  const linkCount = kdo.links?.length ?? 0;

  const updateCheck = async (checkStatus: boolean) => {
    onUpdate({ id: kdo.id, isChecked: checkStatus });

    try {
      await checkMyKdo(kdo.id, checkStatus);
    } catch (error) {
      console.error(error);
      onUpdate({ id: kdo.id, isChecked: !checkStatus });
    }
  }

  const updateText = (newText: string) => {
    onUpdate({ id: kdo.id, label: newText });
    window.clearTimeout(timeout.current);

    // Not cleared on unmount: the label must still be saved if the line
    // moves to the other part of the list in the meantime
    timeout.current = window.setTimeout(() => {
      updateKdoLabel(kdo.id, newText).catch(console.error);
    }, 500);
  }

  const handleDelete = async () => {
    try {
      await deleteKdo(kdo.id);
      onDelete(kdo.id);
    } catch (error) {
      console.error(error);
    }
  }


  const styles: CSS = {
    isChecked: {
      ...checkLineRow,
      textDecoration: isChecked ? "line-through" : "",
    },
    isFocused: {
      visibility: isFocused ? "visible" : "hidden"
    },
    // Always shown when the Kdo has links, so you can see it has some
    linkButton: {
      visibility: isFocused || linkCount > 0 ? "visible" : "hidden"
    },
  };

  return (
    <div className="sm-gap">
      {kdo.author && kdo.author.id !== listAuthorId &&
        <VolontaryKdo user={kdo.author!} />
      }
      <IconInlineText style={styles.isChecked}>
        {dragHandle && <span style={iconSlot}>{dragHandle}</span>}
        <span style={iconSlot}>
          <Checkbox name={`check-${kdo.id}`} checked={isChecked} setChecked={updateCheck} />
        </span>

        <InvisibleTypingInput
          name={`kdo-${kdo.id}`}
          value={kdo.label}
          setValue={updateText}
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <span style={iconSlot}>
          <NoStyleButton onClick={handleDelete} onMouseDown={(e) => e.preventDefault()} style={styles.isFocused} title="Supprimer">
            <XMarkSvg />
          </NoStyleButton>
        </span>

        <span style={iconSlot}>
          <NoStyleButton
            onClick={() => setIsLinksOpen(true)}
            onMouseDown={(e) => e.preventDefault()}
            style={styles.linkButton}
            title={linkCount > 0 ? `Liens (${linkCount})` : "Ajouter un lien"}
          >
            <LinkSvg />
          </NoStyleButton>
        </span>

        <LinksModal
          kdo={kdo}
          editable
          open={isLinksOpen}
          onClose={() => setIsLinksOpen(false)}
          onUpdate={onUpdate}
        />
      </IconInlineText>
    </div>
  );
}
