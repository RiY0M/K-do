import { useState } from "react";
import TypingInput from "../components/inputs/TypingInput";
import FormSection from "../components/sections/FormSection";
import { forgotPassword } from "../services/api/auth";
import { CSS } from "../services/utils";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState<string>("");
  const [sentTo, setSentTo] = useState<string>("");

  const handleSubmit = async () => {
    const { email } = await forgotPassword(identifier.trim());
    setSentTo(email);
  };

  const styles: CSS = {
    message: {
      fontSize: "var(--sm-size)",
    },
  };

  return (
    <FormSection
      title="Mot de passe oublié"
      buttonLabel="Envoyer le lien"
      validatedLabel="E-mail envoyé&nbsp;!"
      redirectMessage="Vous l'avez retrouvé ?"
      redirectLinkMessage="Se connecter"
      redirectUri="/login"
      onSubmit={handleSubmit}
    >
      <p style={styles.message}>
        Un lien pour choisir un nouveau mot de passe sera envoyé à l'e-mail de votre compte.
        Ce n'est possible que si vous en avez renseigné un à l'inscription.
      </p>

      <TypingInput
        label="Nom ou e-mail"
        name="identifier"
        type="text"
        required
        value={identifier}
        setValue={setIdentifier}
      />

      {sentTo &&
        <p style={styles.message}>
          E-mail envoyé à {sentTo}. Le lien est valable une heure.
        </p>
      }
    </FormSection>
  );
}
