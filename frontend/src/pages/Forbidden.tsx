import PageSection from "../components/sections/PageSection";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authStorage";
import { mdSectionIdealWidth, toUrlParam, useOptionalUrl } from "../services/utils";
import Page from "./Page";

export default function Forbidden() {

  const location = useLocation();
  const optionalUrl = useOptionalUrl();
  const url = optionalUrl || (location.pathname.startsWith("/forbidden") ? "" : location.pathname);

  return (
    <Page idealSectionsWidth={mdSectionIdealWidth}>
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
    </Page>
  );
}
