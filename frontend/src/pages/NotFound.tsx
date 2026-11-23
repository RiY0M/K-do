import Page from "./Page";
import NotFoundSection from "../components/sections/specific/NotFoundSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function NotFound() {

  return (
    <Page
      title="Introuvable"
      idealSectionsWidth={mdSectionIdealWidth}
    >
      <NotFoundSection />
    </Page>
  );
}
