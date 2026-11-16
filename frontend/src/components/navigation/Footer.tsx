import { Link } from "react-router-dom";

export default function Footer() {

  return (
    <footer>
      {__APP_NAME__} {__APP_VERSION__} - 2026 - {__AUTHOR_NAME__} - <Link to="/tos" className="sub-text">CGU</Link>
    </footer>
  );
}
