import { CSS } from "../../services/utils";
import { Link } from "react-router-dom";
import IconInlineText from "../IconInlineText";
import ArrowLeft from "../../assets/svgs/ArrowLeft";

export default function MyListRedirect() {

  const styles: CSS = {
    div: {
      fontStyle: "italic",
    },
  }

  return (
    <div style={styles.div}>
      <Link to="/">
        <IconInlineText>
          <ArrowLeft />Ma liste
        </IconInlineText>
      </Link>
    </div>
  );
}
