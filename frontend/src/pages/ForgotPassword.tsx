import Page from "./Page";
import ForgotPasswordSection from "../components/sections/specific/ForgotPasswordSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function ForgotPassword() {

  return (
    <Page
      title="Mot de passe oublié"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <ForgotPasswordSection />
    </Page>
  );
}
