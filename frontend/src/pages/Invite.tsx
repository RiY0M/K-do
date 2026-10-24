import PageSection from "../components/sections/PageSection";
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiStateButton from "../components/buttons/MultiStateButton";
import { acceptInvitation, getInvitation } from "../services/api/invitations";
import { useEffect, useState } from "react";
import { Invitation } from "../interfaces/Invitation";

export default function Invite() {
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [error, setError] = useState<string>("");

  const { invitationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!invitationId) return;

    getInvitation(invitationId)
      .then(setInvitation)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Erreur inconnue"));
  }, [invitationId]);

  const handleClick = async () => {
    const { friendId } = await acceptInvitation(invitationId!);
    navigate(`/friend/${friendId}`);
  }

  const getTitle = () => {
    if (error) return `Invitation invalide : ${error}`;
    if (!invitation) return "Chargement...";
    if (invitation.inviter.isFriend) return `Vous êtes déjà ami avec ${invitation.inviter.name}`;
    return `${invitation.inviter.name} vous invite à rejoindre sa liste « ${invitation.list.label} »`;
  }

  return (
    <PageSection title={getTitle()}>
      <Link to="/"><button>Retour à l'accueil</button></Link>
      {invitation && !invitation.inviter.isFriend &&
        <MultiStateButton onClick={handleClick}>Accepter</MultiStateButton>
      }
      {invitation?.inviter.isFriend &&
        <Link to={`/friend/${invitation.inviter.id}`}><button>Voir sa liste</button></Link>
      }
    </PageSection>
  );
}
