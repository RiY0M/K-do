import { isAuthenticated, logout } from "../../services/authStorage";
import { CSS } from "../../services/utils";
import { Link } from "react-router-dom";
import IconInlineText from "../IconInlineText";
import ArrowLeft from "../../assets/svgs/ArrowLeft";
import NoStyleButton from "../buttons/NoStyleButton";

interface Props {
  forceHomeRedirect?: boolean;
}

export default function Header({ forceHomeRedirect = false }: Readonly<Props>) {

  const isLoggedIn = isAuthenticated();

  const styles: CSS = {
    header: {
      fontStyle: "italic",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  }

  return (
    <header style={styles.header}>
      {isLoggedIn && !forceHomeRedirect ?
        <div style={styles.row}>
          <NoStyleButton onClick={logout}>
            <IconInlineText style={styles.header} className="link">
              <ArrowLeft />Déconnexion
            </IconInlineText>
          </NoStyleButton>
          <Link to="/account">Mon compte</Link>
        </div>
        :
        <Link to="/">
          <IconInlineText>
            <ArrowLeft />Accueil
          </IconInlineText>
        </Link>
      }
    </header>
  );
}
