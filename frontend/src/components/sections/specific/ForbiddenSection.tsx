import PageSection from "../general/PageSection";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../../services/authStorage";
import { toUrlParam, useOptionalUrl } from "../../../services/utils";

export default function ForbiddenSection() {

  const location = useLocation();
  const optionalUrl = useOptionalUrl();
  const url = optionalUrl || (location.pathname.startsWith("/forbidden") ? "" : location.pathname);

  return (
    <PageSection title="Vous n'avez pas le droit d'accéder à cette page.">
      {!isAuthenticated() ?
        <>
          <Link to={`/login${toUrlParam(url)}`}><button>Se connecter</button></Link>
          <Link to={`/register${toUrlParam(url)}`}><button>S'inscrire</button></Link>
        </>
        :
        <Link to="/"><button>Retour à l'accueil</button></Link>
      }
    </PageSection>
  );
}
