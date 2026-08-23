import ListDisplay from "../components/sections/ListDisplay";
import ListPreviews from "../components/sections/ListPreviews";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { List } from "../interfaces/list";
import { getMyLists } from "../services/api/lists";
import { logout } from "../services/authStorage";

export default function Home() {

  const behaviourDisplay = useBehaviourDisplay();

  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    getMyLists().then(setLists);
  }, []);

  const styles: CSS = {
    mainDiv: {
      padding: "var(--sm-space)",
    },
    subDiv: {
      flexDirection: behaviourDisplay === "landscape" ? "row" : "column",
    },
  };

  return (
    <div style={styles.mainDiv}>
      <Link to="/login" onClick={logout}>Déconnexion</Link>
      <div style={styles.subDiv}>
        <ListPreviews lists={lists} />
        <ListDisplay />
      </div>
    </div>
  );
}
