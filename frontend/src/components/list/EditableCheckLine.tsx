import { useRef, useState } from "react";
import NoStyleButton from "../buttons/NoStyleButton";
import XMark from "../../assets/svgs/XMark";
import Checkbox from "../inputs/Checkbox";
import InvisibleTypingInput from "../inputs/InvisibleTypingInput";
import { Kdo, KdoUpdate } from "../../interfaces/Kdo";
import { checkMyKdo, deleteKdo, updateKdoLabel } from "../../services/api/kdos";
import IconInlineText from "../IconInlineText";
import LinkIcon from "../../assets/svgs/LinkIcon";
import LinksModal from "../modals/LinksModal";
import { CSS } from "../../services/utils";

interface Props {
  kdo: Kdo;
  autoFocus?: boolean;
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

export default function EditableCheckLine({
  kdo,
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
    // Updated right away, the line moves to the checked/unchecked part
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
    <IconInlineText style={styles.isChecked}>
      <Checkbox name={`check-${kdo.id}`} checked={isChecked} setChecked={updateCheck} />
      <InvisibleTypingInput
        name={`kdo-${kdo.id}`}
        value={kdo.label}
        setValue={updateText}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <NoStyleButton
        onClick={() => setIsLinksOpen(true)}
        onMouseDown={(e) => e.preventDefault()}
        style={styles.linkButton}
        title={linkCount > 0 ? `Liens (${linkCount})` : "Ajouter un lien"}
      >
        <LinkIcon />
      </NoStyleButton>

      {/* onMouseDown: keeps the focus on the input, otherwise the button
          disappears (blur) before the click is registered */}
      <NoStyleButton onClick={handleDelete} onMouseDown={(e) => e.preventDefault()} style={styles.isFocused} title="Supprimer">
        <XMark />
      </NoStyleButton>

      <LinksModal
        kdo={kdo}
        editable
        open={isLinksOpen}
        onClose={() => setIsLinksOpen(false)}
        onUpdate={onUpdate}
      />
    </IconInlineText>
  );
}
