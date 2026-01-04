import List from "../components/sections/List";
import Groups from "../components/sections/Groups";
import { CSS } from "../services/utils";
import { useBehaviourDisplay } from "../hooks/useBehaviourDisplay";

export default function Home() {

  const behaviourDisplay = useBehaviourDisplay();

  const styles: CSS = {
    div: {
      padding: "var(--sm-space)",
      flexDirection: behaviourDisplay === "landscape" ? "row" : "column",
    },
  };

  return (
    <div style={styles.div}>
      <Groups />
      <List />
    </div>
  );
}
