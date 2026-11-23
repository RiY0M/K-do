import { useState } from "react";
import { logout } from "../../services/authStorage";
import IconInlineText from "../../components/IconInlineText";
import ArrowLeft from "../../assets/svgs/ArrowLeft";
import NoStyleButton from "../../components/buttons/NoStyleButton";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { CSS } from "../../services/utils";

export default function Logout() {

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const styles: CSS = {
    logout: {
      fontStyle: "italic",
    },
  };

  return (
    <>
      <NoStyleButton onClick={() => setIsLogoutModalOpen(true)}>
        <IconInlineText style={styles.logout} className="link">
          <ArrowLeft />Déconnexion
        </IconInlineText>
      </NoStyleButton>

      <ConfirmModal
        title="Se déconnecter ?"
        open={isLogoutModalOpen}
        onConfirm={async () => await logout()}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  )
}