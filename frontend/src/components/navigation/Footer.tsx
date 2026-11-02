import { CSS } from "../../services/utils";
import { Link } from "react-router-dom";

export default function Footer() {

  const styles: CSS = {
    footer: {
      fontSize: "var(--sm-size)",
      fontStyle: "italic",
    },
  }

  return (
    <footer style={styles.footer}>
      {__APP_NAME__} {__APP_VERSION__} - 2026 - {__AUTHOR_NAME__} - <Link to="/tos" style={styles.footer}>CGU</Link>
    </footer>
  );
}
