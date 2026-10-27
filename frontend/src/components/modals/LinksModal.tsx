import { useState } from "react";
import XMark from "../../assets/svgs/XMark";
import { Kdo, KdoUpdate } from "../../interfaces/Kdo";
import { Link } from "../../interfaces/Link";
import { addKdoLink, deleteKdoLink } from "../../services/api/kdos";
import { CSS } from "../../services/utils";
import MultiStateButton from "../buttons/MultiStateButton";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../IconInlineText";
import TypingInput from "../inputs/TypingInput";
import Modal from "./Modal";

interface Props {
  kdo: Kdo;
  // Only the author of the Kdo can add or remove links
  editable: boolean;
  open: boolean;
  onClose: () => void;
  onUpdate?: (kdo: KdoUpdate) => void;
}

// "https://www.exemple.com/produit/" -> "exemple.com/produit"
function formatLink(href: string): string {
  try {
    const url = new URL(href);
    const text = `${url.hostname.replace(/^www\./, "")}${url.pathname}`.replace(/\/$/, "");
    return text.length > 60 ? `${text.slice(0, 57)}...` : text;
  } catch {
    return href;
  }
}

// Adds https:// when the scheme is missing ("exemple.com/produit")
function normalizeLink(value: string): string {
  const trimmed = value.trim();
  const href = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(href);
    if ((url.protocol !== "http:" && url.protocol !== "https:") || !url.hostname.includes(".")) {
      throw new Error();
    }
    return url.href;
  } catch {
    throw new Error("Lien invalide");
  }
}

export default function LinksModal({
  kdo,
  editable,
  open,
  onClose,
  onUpdate,
}: Readonly<Props>) {
  const [newLink, setNewLink] = useState<string>("");
  const links = kdo.links ?? [];

  const handleAdd = async () => {
    if (!newLink.trim()) {
      throw new Error("Entrez un lien");
    }

    const link = await addKdoLink(kdo.id, normalizeLink(newLink));
    onUpdate?.({ id: kdo.id, links: [...links, link] });
    setNewLink("");
  };

  const handleDelete = async (link: Link) => {
    try {
      await deleteKdoLink(link.id);
      onUpdate?.({ id: kdo.id, links: links.filter((other) => other.id !== link.id) });
    } catch (error) {
      console.error(error);
    }
  };

  const styles: CSS = {
    list: {
      gap: "var(--sm-space)",
    },
    line: {
      justifyContent: "space-between",
    },
    link: {
      overflowWrap: "anywhere",
    },
    empty: {
      fontSize: "var(--sm-size)",
    },
    form: {
      gap: "var(--sm-space)",
    },
  };

  return (
    <Modal open={open} title={kdo.label || "Liens"} onClose={onClose}>
      <div style={styles.list}>
        {links.map((link) => (
          <IconInlineText key={link.id} style={styles.line}>
            <a href={link.href} target="_blank" rel="noopener noreferrer" style={styles.link} title={link.href}>
              {formatLink(link.href)}
            </a>
            {editable &&
              <NoStyleButton onClick={() => handleDelete(link)} title="Retirer ce lien">
                <XMark />
              </NoStyleButton>
            }
          </IconInlineText>
        ))}
        {links.length === 0 &&
          <span style={styles.empty}>Aucun lien pour l'instant.</span>
        }
      </div>

      {editable &&
        <form onSubmit={(event) => event.preventDefault()}>
          <div style={styles.form}>
            <TypingInput
              label="Ajouter un lien"
              name={`new-link-${kdo.id}`}
              placeholder="https://..."
              maxLength={2048}
              value={newLink}
              setValue={setNewLink}
              type="link"
            />
            <MultiStateButton onClick={handleAdd} validatedLabel="Ajouté&nbsp;!">
              Ajouter
            </MultiStateButton>
          </div>
        </form>
      }
    </Modal>
  );
}
