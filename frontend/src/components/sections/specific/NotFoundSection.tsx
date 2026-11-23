import { Link } from "react-router-dom";
import PageSection from "../general/PageSection";

export default function NotFoundSection() {

  return (
    <PageSection title="Oups, la page que vous cherchez n'existe pas&nbsp;!">
      <Link to="/"><button>Retour à l'accueil</button></Link>
    </PageSection>
  );
}
