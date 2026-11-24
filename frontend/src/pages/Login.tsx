import Page from "./Page";
import LoginSection from "../components/sections/specific/LoginSection";
import { mdSectionIdealWidth } from "../services/utils";
import NavLink from "../components/navigation/redirects/NavLink";
import HomeRedirect from "../components/navigation/redirects/HomeRedirect";

export default function Login() {

  const reverseButtons = false; // TODO : user parameter

  return (
    <Page
      title="Connexion"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <NavLink soloButton reverseDirection={reverseButtons}>
        <HomeRedirect reverseDirection={reverseButtons} />
      </NavLink>

      <LoginSection />
    </Page>
  );
}
