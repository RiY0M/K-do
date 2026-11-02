import { CSS } from "../../../services/utils";
import FullAccordion from "../../accordions/FullAccordion";
import { Kdo, KdoUpdate } from "../../../interfaces/Kdo";
import ListKdos from "../ListKdos";

interface Props {
  listAuthorId: string;
  kdos: Kdo[];
  onUpdate: (kdo: KdoUpdate) => void;
  onDelete: (id: string) => void;
}

export default function FriendCheckedList({
  listAuthorId,
  kdos,
  onUpdate,
  onDelete,
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
    },
  };

  return (
    <FullAccordion label="Éléments cochés" defaultOpening={true}>
      <div style={styles.div}>
        <ListKdos listAuthorId={listAuthorId} kdos={kdos} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </FullAccordion>
  );
}
