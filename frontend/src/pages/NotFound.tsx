import PageSection from "../components/sections/PageSection";
import { Link } from "react-router-dom";

export default function NotFound() {

  return (
    <PageSection title="Oups, la page que vous cherchez n'existe pas&nbsp;!">
      <Link to="/"><button>Retour à l'accueil</button></Link>
    </PageSection>
  );
}
