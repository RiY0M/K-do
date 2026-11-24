import Page from "./Page";
import { lgSectionIdealWidth } from "../services/utils";
import TosSection from "../components/sections/specific/TosSection";
import BackLink from "../components/navigation/redirects/BackLink";
import NavLink from "../components/navigation/redirects/NavLink";

export default function Tos() {
  return (
    <Page
      title="CGU"
      idealWidthLandscape={lgSectionIdealWidth}
      idealWidthPortrait={lgSectionIdealWidth}
    >
      <NavLink soloButton>
        <BackLink reverseDirection />
      </NavLink>
      <TosSection />
    </Page>
  );
}
