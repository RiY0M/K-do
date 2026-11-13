import { FriendOverview } from "../../interfaces/FriendOverview";
import { User } from "../../interfaces/User";
import { CSS } from "../../services/utils";
import XMark from "../../assets/svgs/XMark";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../IconInlineText";
import UserLink from "../UserLink";

interface Props {
  friend: FriendOverview;
  onRemove: (friend: User) => void;
}

// Beginning of a label, for the line of taken gifts
const excerpt = (label: string, maxLength = 20) => {
  const trimmed = label.trim();
  if (!trimmed) return "Sans nom";
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength).trimEnd()}…` : trimmed;
};

const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? "s" : ""}`;

export default function FriendLine({
  friend,
  onRemove,
}: Readonly<Props>) {

  const { news, takenByMe } = friend;
  const newsParts = [
    news.added > 0 && plural(news.added, "ajouté"),
    news.edited > 0 && plural(news.edited, "modifié"),
    news.deleted > 0 && plural(news.deleted, "supprimé"),
    news.taken > 0 && `${news.taken} pris`,
  ].filter((part): part is string => !!part);
  const hasNews = newsParts.length > 0;

  const styles: CSS = {
    div: {
      gap: "var(--xs-space)",
    },
    line: {
      justifyContent: "space-between",
    },
    name: {
      gap: "var(--xs-space)",
    },
    count: {
      opacity: 0.8,
    },
    newsDot: {
      color: "var(--action)",
      fontSize: "var(--sm-size)",
    },
    small: {
      fontSize: "var(--sm-size)",
    },
    news: {
      fontSize: "var(--sm-size)",
      color: "var(--action)",
    },
    taken: {
      fontSize: "var(--sm-size)",
      opacity: 0.8,
      // A single line, cut with "…" when too long
      display: "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  };

  return (
    <div style={styles.div}>
      <IconInlineText style={styles.line}>
        <IconInlineText style={styles.name}>
          <UserLink user={friend} />
          <span style={styles.count} title={`Cadeaux que vous avez pris pour ${friend.name}`}>
            ({takenByMe.length})
          </span>
          {hasNews &&
            <span style={styles.newsDot} title="Nouveautés depuis votre dernière visite de sa liste" aria-hidden>●</span>
          }
        </IconInlineText>

        <NoStyleButton onClick={() => onRemove(friend)} title={`Retirer ${friend.name} de mes amis`}>
          <XMark />
        </NoStyleButton>
      </IconInlineText>

      {hasNews &&
        <span style={styles.news}>Nouveau : {newsParts.join(" · ")}</span>
      }

      {takenByMe.length > 0 &&
        <span style={styles.taken} title={takenByMe.map((kdo) => kdo.label.trim() || "Sans nom").join("\n")}>
          {takenByMe.map((kdo) => excerpt(kdo.label)).join(", ")}
        </span>
      }
    </div>
  );
}
