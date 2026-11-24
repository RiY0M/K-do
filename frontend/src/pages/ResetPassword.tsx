import Page from "./Page";
import ResetPasswordSection from "../components/sections/specific/ResetPasswordSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function ResetPassword() {

  return (
    <Page
      title="Réinitialisation du mot de passe"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <ResetPasswordSection />
    </Page>
  );
}
