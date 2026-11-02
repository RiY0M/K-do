import MyFullListSection from "../components/sections/MyFullListSection";
import FriendsSection from "../components/sections/FriendsSection";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";
import { useCallback, useEffect, useState } from "react";
import { List } from "../interfaces/List";
import { getMyLists } from "../services/api/lists";
import Header from "../components/navigation/Header";

export default function MyHome() {

  const behaviourDisplay = useBehaviourDisplay();

  const [lists, setLists] = useState<List[]>([]);
  // The backend always returns at least the default list ("Tous")
  const selectedList = lists[0] ?? null;

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

  const styles: CSS = {
    subDiv: {
      flexDirection: behaviourDisplay === "landscape" ? "row" : "column-reverse",
    },
  };

  return (
    <>
      <Header />
      <div style={styles.subDiv}>
        <FriendsSection onFriendsChange={refreshLists} />
        {/* <div>
          <ListPreviews lists={lists} />
        </div> */}
        {selectedList && <MyFullListSection listPreview={selectedList} />}
      </div>
    </>
  );
}
