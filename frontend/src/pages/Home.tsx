import ListDisplay from "../components/sections/ListDisplay";
import ListPreviews from "../components/sections/ListPreviews";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { List } from "../interfaces/List";
import { createList, getMyLists } from "../services/api/lists";
import { logout } from "../services/authStorage";
import IconInlineText from "../components/IconInlineText";
import ArrowLeft from "../assets/svgs/ArrowLeft";

export default function Home() {

  const behaviourDisplay = useBehaviourDisplay();

  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  useEffect(() => {
    getMyLists().then(async (myLists) => {
      setLists(myLists);

      let currentList = myLists[0];
      if (!currentList) {
        currentList = await createList("Tous");
      }
      setSelectedList(currentList);
    });
  }, []);

  const styles: CSS = {
    mainDiv: {
      padding: "var(--sm-space)",
      flexDirection: behaviourDisplay === "landscape" ? "column" : "column-reverse",
    },
    subDiv: {
      flexDirection: behaviourDisplay === "landscape" ? "row" : "column-reverse",
    },
  };

  return (
    <div style={styles.mainDiv}>
      <Link to="/login" onClick={logout}>
        <IconInlineText>
          <ArrowLeft />Déconnexion
        </IconInlineText>
      </Link>
      <div style={styles.subDiv}>
        <ListPreviews lists={lists} />
        {selectedList && <ListDisplay listPreview={selectedList} />}
      </div>
    </div>
  );
}
