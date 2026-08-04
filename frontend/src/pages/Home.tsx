import List from "../components/sections/List";
import Groups from "../components/sections/Groups";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Group } from "../interfaces/group";
import { getMyGroups } from "../services/groups";

export default function Home() {

  const behaviourDisplay = useBehaviourDisplay();

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    getMyGroups().then(setGroups);
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
      <Link to="/login">Déconnexion</Link>
      <div style={styles.subDiv}>
        <Groups groups={groups} />
        <List />
      </div>
    </div>
  );
}
