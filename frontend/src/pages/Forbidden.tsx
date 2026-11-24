import Page from "./Page";
import ForbiddenSection from "../components/sections/specific/ForbiddenSection";
import { mdSectionIdealWidth } from "../services/utils";

export default function Forbidden() {

  return (
    <Page
      title="Interdit"
      idealWidthLandscape={mdSectionIdealWidth}
      idealWidthPortrait={mdSectionIdealWidth}
    >
      <ForbiddenSection />
    </Page>
  );
}
