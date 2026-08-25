import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import GuestHome from "./pages/GuestHome";
import Invite from "./pages/Invite";
import Forbidden from "./pages/Forbidden";
import { isAuthenticated } from "./services/authStorage";
import { CSS, listDisplayIdealWidth } from "./services/utils";
import { useBehaviourDisplay } from "./hooks/useBehaviourDisplay";

export default function App() {
  const isLoggedIn = isAuthenticated();
  const behaviourDisplay = useBehaviourDisplay();
  const isLandscape = behaviourDisplay === "landscape";

  const styles: CSS = {
    app: {
      width: isLandscape ? `min(${listDisplayIdealWidth + 200}px, 100%)` : `min(${listDisplayIdealWidth}px, 100%)`,
    }
  }
  return (
    <div id="app" style={styles.app}>
      <Routes>
        {!isLoggedIn && <>
          <Route path="/" element={<Forbidden />} />
          <Route path="/guest/:userId" element={<Forbidden />} />
          <Route path="/invite/:userId" element={<Forbidden />} />
        </>}
        {isLoggedIn && <>
          <Route path="/" element={<Home />} />
          <Route path="/guest/:userId" element={<GuestHome />} />
          <Route path="/invite/:userId" element={<Invite />} />
        </>}
        <Route path="/login/:url?" element={<Login />} />
        <Route path="/register/:url?" element={<Register />} />
        <Route path="/forbidden/:url?" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
