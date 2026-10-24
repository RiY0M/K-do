import { Routes, Route } from "react-router-dom";
import MyHome from "./pages/MyHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FriendHome from "./pages/FriendHome";
import Invite from "./pages/Invite";
import Forbidden from "./pages/Forbidden";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { isAuthenticated } from "./services/authStorage";
import { CSS, groupSectionIdealWidth, listSectionActualWidth, listSectionIdealWidth } from "./services/utils";
import { useBehaviourDisplay } from "./hooks/useBehaviourDisplay";

export default function App() {
  const isLoggedIn = isAuthenticated();
  const behaviourDisplay = useBehaviourDisplay();
  const isLandscape = behaviourDisplay === "landscape";

  const styles: CSS = {
    app: {
      width: isLandscape ? `min(calc(${listSectionIdealWidth + groupSectionIdealWidth}px + var(--md-space)), 100%)` : listSectionActualWidth,
    }
  }
  return (
    <div id="app" style={styles.app}>
      <Routes>
        {!isLoggedIn && <>
          <Route path="/" element={<Forbidden />} />
          <Route path="/friend/:userId" element={<Forbidden />} />
          <Route path="/invite/:invitationId" element={<Forbidden />} />
        </>}
        {isLoggedIn && <>
          <Route path="/" element={<MyHome />} />
          <Route path="/friend/:userId" element={<FriendHome />} />
          <Route path="/invite/:invitationId" element={<Invite />} />
        </>}
        <Route path="/login/:url?" element={<Login />} />
        <Route path="/register/:url?" element={<Register />} />
        <Route path="/forbidden/:url?" element={<Forbidden />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
