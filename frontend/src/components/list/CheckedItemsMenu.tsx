import { useEffect, useRef, useState } from "react";
import EllipsisVertical from "../../assets/svgs/EllipsisVertical";
import { Kdo, KdoUpdate } from "../../interfaces/Kdo";
import { checkMyKdo, deleteKdo } from "../../services/api/kdos";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import ConfirmModal from "../modals/ConfirmModal";

interface Props {
  // The checked Kdos I'm the author of: the only ones these actions touch
  kdos: Kdo[];
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

/**
 * ⋮ menu before "Éléments cochés": uncheck all my checked Kdos, or delete
 * them all (after a confirmation). Hidden when I have none.
 */
export default function CheckedItemsMenu({
  kdos,
  onUpdate,
  onDelete,
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Closes on a click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (kdos.length === 0) return null;

  // Unchecked right away (the lines move back up), each one rolled back if
  // the server refuses it
  const uncheckAll = async () => {
    setIsOpen(false);

    const results = await Promise.allSettled(kdos.map(async (kdo) => {
      onUpdate({ id: kdo.id, isChecked: false });
      try {
        await checkMyKdo(kdo.id, false);
      } catch (error) {
        onUpdate({ id: kdo.id, isChecked: true });
        throw error;
      }
    }));

    results.forEach((result) => {
      if (result.status === "rejected") console.error(result.reason);
    });
  };

  const deleteAll = async () => {
    const results = await Promise.allSettled(kdos.map(async (kdo) => {
      await deleteKdo(kdo.id);
      onDelete(kdo.id);
    }));

    if (results.some((result) => result.status === "rejected")) {
      throw new Error("Certains cadeaux n'ont pas pu être supprimés");
    }
  };

  const styles: CSS = {
    container: {
      position: "relative",
    },
    menu: {
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: 2,
      gap: "var(--xs-space)",
      padding: "var(--sm-space)",
      background: "var(--mainer)",
      boxShadow: "var(--shadow)",
      borderRadius: "var(--sm-rounded-radius)",
      whiteSpace: "nowrap",
    },
  };

  return (
    <div ref={menuRef} style={styles.container}>
      <NoStyleButton onClick={() => setIsOpen(!isOpen)} title="Actions sur mes éléments cochés">
        <EllipsisVertical />
      </NoStyleButton>

      {isOpen &&
        <div role="menu" style={styles.menu}>
          <NoStyleButton onClick={uncheckAll}>Tout décocher</NoStyleButton>
          <NoStyleButton onClick={() => { setIsOpen(false); setIsConfirmOpen(true); }}>
            <span className="important">Supprimer les éléments cochés</span>
          </NoStyleButton>
        </div>
      }

      <ConfirmModal
        open={isConfirmOpen}
        title={kdos.length > 1 ? `Supprimer les ${kdos.length} éléments cochés ?` : "Supprimer l'élément coché ?"}
        confirmLabel="Supprimer"
        onConfirm={deleteAll}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
