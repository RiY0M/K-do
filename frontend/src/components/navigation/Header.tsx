import { isAuthenticated, logout } from "../../services/authStorage";
import { CSS } from "../../services/utils";
import { Link } from "react-router-dom";
import IconInlineText from "../IconInlineText";
import ArrowLeft from "../../assets/svgs/ArrowLeft";

interface Props {
  forceHomeRedirect?: boolean;
}

export default function Header({ forceHomeRedirect = false }: Readonly<Props>) {

  const isLoggedIn = isAuthenticated();

  const styles: CSS = {
    header: {
      fontSize: "var(--sm-size)",
      fontStyle: "italic",
    },
  }

  return (
    <header style={styles.header}>
      {isLoggedIn && !forceHomeRedirect ?
        <Link to="/login" onClick={logout}>
          <IconInlineText>
            <ArrowLeft />Déconnexion
          </IconInlineText>
        </Link>
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
