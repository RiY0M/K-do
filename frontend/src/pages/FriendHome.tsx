import FriendFullListSection from "../components/sections/FriendFullListSection";
import MyListRedirect from "../components/navigation/MyListRedirect";
import { lgSectionIdealWidth } from "../services/utils";
import Page from "./Page";

export default function FriendHome() {

  return (
    <Page idealSectionsWidth={lgSectionIdealWidth}>
      <MyListRedirect />
      <FriendFullListSection />
    </Page>
  );
}
