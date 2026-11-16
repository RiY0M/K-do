import { KdoNews } from "../../../interfaces/Kdo";
import { CSS } from "../../../services/utils";

interface Props {
  news: KdoNews;
}

// Same marker as next to a friend's name on the home page (FriendLine): what
// changed on this gift since my last visit of the list
export default function KdoNewsTag({
  news,
}: Readonly<Props>) {

  const edited =
    news.label && news.links ? "Nom et liens modifiés"
      : news.label ? "Nom modifié"
        : news.links ? "Liens modifiés"
          : null;

  const parts = [
    news.added && "Nouveau",
    edited,
    news.taken && "Pris récemment",
  ].filter((part): part is string => !!part);

  const styles: CSS = {
    tag: {
      color: "var(--action)",
    },
  };

  return (
    <span style={styles.tag} className="sub-text" title="Depuis votre dernière visite de cette liste">
      ● {parts.join(" · ")}
    </span>
  );
}
