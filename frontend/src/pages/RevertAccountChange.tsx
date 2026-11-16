import { useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../components/sections/FormSection";
import { revertAccountChange } from "../services/api/auth";

// Opened from the link of the e-mail sent after an e-mail / password change:
// /revert-account-change/:token
export default function RevertAccountChange() {
  const [result, setResult] = useState<{ restoredEmail: boolean; restoredPassword: boolean } | null>(null);

  const { token } = useParams();

  const handleSubmit = async () => {
    setResult(await revertAccountChange(token!));
  };

  const restored = result
    ? [result.restoredEmail && "l'adresse e-mail", result.restoredPassword && "le mot de passe"].filter(Boolean).join(" et ")
    : "";

  return (
    <FormSection
      title="Annuler les changements"
      buttonLabel="Annuler les changements"
      validatedLabel="Changements annulés&nbsp;!"
      redirectMessage="Quelqu'un d'autre connaît votre mot de passe ?"
      redirectLinkMessage="Le changer"
      redirectUri="/forgot-password"
      onSubmit={handleSubmit}
    >
      {!result &&
        <p className="sub-text">
          Votre compte reprendra l'adresse e-mail et/ou le mot de passe d'avant le changement,
          et toutes les sessions seront déconnectées.
        </p>
      }

      {result &&
        <p className="sub-text">
          C'est fait : {restored} {result.restoredEmail && result.restoredPassword ? "ont été remis" : "a été remis"} comme
          avant, et toutes les sessions ont été déconnectées. Si quelqu'un d'autre connaissait votre mot
          de passe, changez-le avec le lien ci-dessous.
        </p>
      }
    </FormSection>
  );
}
