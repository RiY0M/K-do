import { Link } from "react-router-dom";
import { CSS } from "../services/utils";

export default function NotFound() {

  const styles: CSS = {
    section: {
      transform: "scale(1.5)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--xl-space)",
      alignItems: "center",
    },
  }

  return (
    <section style={styles.section}>
      <h1>Oups, la page que vous cherchez n'existe pas !</h1>
      <Link to="/"><button>Retour à l'accueil</button></Link>
    </section>
  );
}
