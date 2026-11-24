import FriendFullListSection from "../components/sections/specific/FriendFullListSection";
import MyListRedirect from "../components/navigation/redirects/MyListRedirect";
import { lgSectionIdealWidth } from "../services/utils";
import Page from "./Page";
import { getUsername } from "../services/api/users";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavLink from "../components/navigation/redirects/NavLink";

export default function FriendList() {

  const { userId } = useParams();
  const reverseButtons = false; // TODO : user parameter
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (userId) {
      getUsername(userId).then(setUsername);
    }
  }, [userId]);

  return (
    <Page
      title={username}
      idealWidthLandscape={lgSectionIdealWidth}
      idealWidthPortrait={lgSectionIdealWidth}
    >
      <NavLink soloButton reverseDirection={reverseButtons}>
        <MyListRedirect reverseDirection={reverseButtons} />
      </NavLink>
      <FriendFullListSection username={username} />
    </Page >
  );
}
