import PageSection from "../components/sections/PageSection";
import { Link } from "react-router-dom";
import Page from "./Page";
import { mdSectionIdealWidth } from "../services/utils";

export default function NotFound() {

  return (
    <Page idealSectionsWidth={mdSectionIdealWidth}>
      <PageSection title="Oups, la page que vous cherchez n'existe pas&nbsp;!">
        <Link to="/"><button>Retour à l'accueil</button></Link>
      </PageSection>
    </Page>
  );
}
