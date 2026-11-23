import Page from "./Page";
import RegisterSection from "../components/sections/specific/RegisterSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function Register() {

  return (
    <Page
      title="Inscription"
      idealSectionsWidth={mdSectionIdealWidth}
    >
      <RegisterSection />
    </Page>
  );
}
