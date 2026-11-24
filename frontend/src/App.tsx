import { Routes, Route } from "react-router-dom";
import MyList from "./pages/MyList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import FriendList from "./pages/FriendList";
import Invite from "./pages/Invite";
import Forbidden from "./pages/Forbidden";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Tos from "./pages/Tos";
import Account from "./pages/Account";
import RevertAccountChange from "./pages/RevertAccountChange";
import Home from "./pages/Home";
// import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import { isAuthenticated } from "./services/authStorage";

export default function App() {

  const isLoggedIn = isAuthenticated();

  return (
    <>
      {/* <Header /> */}
      <div id="main">
        <Routes>
          {!isLoggedIn && <>
            <Route path="/list" element={<Forbidden />} />
            <Route path="/friend/:userId" element={<Forbidden />} />
            <Route path="/invite/:invitationId" element={<Forbidden />} />
            <Route path="/account" element={<Forbidden />} />
          </>}
          {isLoggedIn && <>
            <Route path="/list" element={<MyList />} />
            <Route path="/friend/:userId" element={<FriendList />} />
            <Route path="/invite/:invitationId" element={<Invite />} />
            <Route path="/account" element={<Account />} />
          </>}
          <Route path="/" element={<Home />} />
          <Route path="/login/:url?" element={<Login />} />
          <Route path="/register/:url?" element={<Register />} />
          <Route path="/forbidden/:url?" element={<Forbidden />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/revert-account-change/:token" element={<RevertAccountChange />} />
          <Route path="/tos" element={<Tos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
