import Page from "./Page";
import RevertAccountChangeSection from "../components/sections/specific/RevertAccountChangeSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function RevertAccountChange() {

  return (
    <Page
      title="Annuler les changements"
      idealSectionsWidth={mdSectionIdealWidth}
    >
      <RevertAccountChangeSection />
    </Page>
  );
}
