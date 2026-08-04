import GuestList from "../components/sections/GuestList";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";
import { Link } from "react-router-dom";

export default function GuestHome() {

  const behaviourDisplay = useBehaviourDisplay();

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
      <Link to="/">Accueil</Link>
      <div style={styles.subDiv}>
        <GuestList />
      </div>
    </div>
  );
}
