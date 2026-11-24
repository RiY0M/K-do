import Page from "./Page";
import InviteSection from "../components/sections/specific/InviteSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function Invite() {

  return (
    <Page
      title="Invitation"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <InviteSection />
    </Page>
  );
}
