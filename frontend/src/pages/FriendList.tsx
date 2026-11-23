import FriendFullListSection from "../components/sections/specific/FriendFullListSection";
import MyListRedirect from "../components/navigation/MyListRedirect";
import { lgSectionIdealWidth } from "../services/utils";
import Page from "./Page";
import { getUsername } from "../services/api/users";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FriendList() {

  const { userId } = useParams();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (userId) {
      getUsername(userId).then(setUsername);
    }
  }, [userId]);

  return (
    <Page
      title={username}
      idealSectionsWidth={lgSectionIdealWidth}
    >
      <MyListRedirect />
      <FriendFullListSection username={username} />
    </Page>
  );
}
