import Page from "./Page";
import RegisterSection from "../components/sections/specific/RegisterSection";
import { mdSectionIdealWidth } from "../services/utils";
import NavLink from "../components/navigation/redirects/NavLink";
import HomeRedirect from "../components/navigation/redirects/HomeRedirect";

export default function Register() {

  const reverseButtons = false; // TODO : user parameter

  return (
    <Page
      title="Inscription"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <NavLink soloButton reverseDirection={reverseButtons}>
        <HomeRedirect reverseDirection={reverseButtons} />
      </NavLink>

      <RegisterSection />
    </Page>
  );
}
