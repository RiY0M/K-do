import MyFullListSection from "../components/sections/specific/MyFullListSection";
import FriendsSection from "../components/sections/specific/FriendsSection";
import { lgSectionIdealWidth, smSectionIdealWidth } from "../services/utils"; import { useCallback, useEffect, useState } from "react";
import { List } from "../interfaces/List";
import { getMyLists } from "../services/api/lists";
import Page from "./Page";
import InlineSections from "../components/statics/InlineSections";
import AccountRedirect from "../components/navigation/redirects/AccountRedirect";
import HomeRedirect from "../components/navigation/redirects/HomeRedirect";
import NavLink from "../components/navigation/redirects/NavLink";

export default function MyList() {

  const [lists, setLists] = useState<List[]>([]);
  // The backend always returns at least the default list ("Tous")
  const selectedList = lists[0] ?? null;
  const reverseButtons = false; // TODO : user parameter

  // Also called when friends change, to refresh the members of the lists
  const refreshLists = useCallback(async () => {
    try {
      setLists(await getMyLists());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getMyLists().then(setLists).catch(console.error);
  }, []);

  return (
    <Page
      title="Ma liste"
      idealWidthLandscape={lgSectionIdealWidth + smSectionIdealWidth}
      idealWidthPortrait={lgSectionIdealWidth}
      nbInlineSections={2}
    >
      <NavLink reverseDirection={reverseButtons}>
        <HomeRedirect reverseDirection />
        <AccountRedirect />
      </NavLink>


      <InlineSections reverseOnChangeDirection>
        {selectedList && <MyFullListSection listPreview={selectedList} />}
        <FriendsSection onFriendsChange={refreshLists} />
        {/* <div>
          <ListPreviews lists={lists} />
        </div> */}
      </InlineSections>
    </Page>
  );
}
