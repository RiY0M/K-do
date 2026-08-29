import FriendFullListSection from "../components/sections/FriendFullListSection";
import { CSS } from "../services/utils";
import { Link } from "react-router-dom";
import IconInlineText from "../components/IconInlineText";
import ArrowLeft from "../assets/svgs/ArrowLeft";

export default function FriendHome() {

  const styles: CSS = {
    mainDiv: {
      padding: "var(--sm-space)",
    },
  };

  return (
    <div style={styles.mainDiv}>
      <Link to="/">
        <IconInlineText>
          <ArrowLeft />Accueil
        </IconInlineText>
      </Link>
      <FriendFullListSection />
    </div>
  );
}
