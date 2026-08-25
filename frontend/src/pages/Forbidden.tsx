import PageSection from "../components/sections/PageSection";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/authStorage";
import { getOptionalUrl } from "../services/utils";

export default function Forbidden() {

  const url = getOptionalUrl();

  return (
    <PageSection title="Vous n'avez pas le droit d'accéder à cette page.">
      {!isAuthenticated() ?
        <Link to={`/login/${url}`}><button>Se connecter</button></Link>
        :
        <Link to="/"><button>Retour à l'accueil</button></Link>
      }
    </PageSection>
  );
}
