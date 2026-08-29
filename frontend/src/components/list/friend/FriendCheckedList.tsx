import { CSS } from "../../../services/utils";
import FullAccordion from "../../accordions/FullAccordion";
import { Kdo } from "../../../interfaces/Kdo";
import ListKdos from "../ListKdos";

interface Props {
  kdos: Kdo[];
}

export default function FriendCheckedList({
  kdos
}: Readonly<Props>) {

  const styles: CSS = {
    div: {
      marginTop: "var(--sm-space)",
    },
  };

  return (
    <FullAccordion label="Éléments cochés" defaultOpening={true}>
      <div style={styles.div}>
        <ListKdos kdos={kdos} />
      </div>
    </FullAccordion>
  );
}
