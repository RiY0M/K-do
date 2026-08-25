import PageSection from "../components/sections/PageSection";
import { Link, useParams } from "react-router-dom";
import MultiStateButton from "../components/buttons/MultiStateButton";
import { acceptInvite, getUsername } from "../services/api/users";
import { useEffect, useState } from "react";

export default function Invite() {
  const [userName, setUserName] = useState<string>("");

  const { userId } = useParams();

  useEffect(() => {
    getUsername(userId!).then(setUserName);
  }, [])

  const handleClick = async () => {
    await acceptInvite(userId!)
  }

  return (
    <PageSection title={`Vous êtes invité à rejoindre la liste de : ${userName}`}>
      <Link to="/"><button>Retour à l'accueil</button></Link>
      <MultiStateButton onClick={handleClick}>Accepter</MultiStateButton>
    </PageSection>
  );
}
