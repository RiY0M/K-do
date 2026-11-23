import { useState } from "react";
import { useParams } from "react-router-dom";
import TypingInput from "../../../components/inputs/TypingInput";
import FormSection from "../general/FormSection";
import { resetPassword } from "../../../services/api/auth";

export default function ResetPasswordSection() {
  const [password, setPassword] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");

  const { token } = useParams();

  const handleSubmit = async () => {
    if (password.length < 4) {
      throw new Error("4 caractères minimum");
    }
    if (password !== confirmation) {
      throw new Error("Les mots de passe sont différents");
    }

    await resetPassword(token!, password);

    // Leaves time to read the confirmation on the button
    window.setTimeout(() => window.location.assign("/login"), 1500);
  };

  return (
    <FormSection
      title="Nouveau mot de passe"
      buttonLabel="Changer le mot de passe"
      validatedLabel="Mot de passe changé&nbsp;!"
      redirectMessage="Lien expiré ?"
      redirectLinkMessage="En demander un nouveau"
      redirectUri="/forgot-password"
      onSubmit={handleSubmit}
    >
      <TypingInput
        label="Nouveau mot de passe"
        name="password"
        type="password"
        required
        value={password}
        setValue={setPassword}
      />

      <TypingInput
        label="Confirmation"
        name="confirmation"
        type="password"
        required
        value={confirmation}
        setValue={setConfirmation}
      />
    </FormSection>
  );
}
