import FriendFullListSection from "../components/sections/FriendFullListSection";
import Header from "../components/navigation/Header";

export default function FriendHome() {

  return (
    <div>
      <Header forceHomeRedirect />
      <FriendFullListSection />
    </div>
  );
}
