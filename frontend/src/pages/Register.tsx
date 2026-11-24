import Page from "./Page";
import RegisterSection from "../components/sections/specific/RegisterSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function Register() {

  return (
    <Page
      title="Inscription"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <RegisterSection />
    </Page>
  );
}
