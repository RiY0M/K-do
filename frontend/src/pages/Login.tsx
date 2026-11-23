import Page from "./Page";
import LoginSection from "../components/sections/specific/LoginSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function Login() {

  return (
    <Page
      title="Connexion"
      idealSectionsWidth={mdSectionIdealWidth}
    >
      <LoginSection />
    </Page>
  );
}
