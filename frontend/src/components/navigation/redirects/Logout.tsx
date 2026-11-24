import { useState } from "react";
import { logout } from "../../../services/authStorage";
import ArrowLeftStartOnRectangleSvg from "../../../assets/svgs/ArrowLeftStartOnRectangleSvg";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import NoStyleButtonRedirect from "./NoStyleButtonRedirect";
import { RedirectProps } from "../../../interfaces/RedirectProps";

export default function Logout({
  reverseDirection,
}: Readonly<RedirectProps>) {

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  return (
    <>
      <NoStyleButtonRedirect
        onClick={() => setIsLogoutModalOpen(true)}
        label="Déconnexion"
        svg={<ArrowLeftStartOnRectangleSvg />}
        reverseDirection={reverseDirection}
      />

      <ConfirmModal
        title="Se déconnecter ?"
        open={isLogoutModalOpen}
        onConfirm={async () => await logout()}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  )
}
