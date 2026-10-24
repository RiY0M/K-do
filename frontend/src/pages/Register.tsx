import { useState } from "react";
import { registerAndSaveSession } from "../services/authStorage";
import { toUrlParam, useOptionalUrl } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";
import FormSection from "../components/sections/FormSection";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Page to go back to once registered (e.g. an invitation)
  const url = useOptionalUrl();

  const handleSubmit = async () => {
    await registerAndSaveSession({
      name: name,
      email: email,
      password: password,
    }, url || "/");
  };

  return (
    <FormSection
      title="Inscription"
      buttonLabel="S'inscrire"
      redirectMessage="Déjà inscrit ?"
      redirectLinkMessage="Se connecter"
      redirectUri={`/login${toUrlParam(url)}`}
      onSubmit={handleSubmit}
    >
      <TypingInput
        label="Nom"
        name="name"
        type="text"
        required
        maxLength={32}
        value={name}
        setValue={setName}
      />

      <TypingInput
        label="E-mail"
        name="email"
        type="email"
        placeholder="k-do@exemple.com"
        hint="Facultatif, mais nécessaire pour récupérer votre mot de passe"
        value={email}
        setValue={setEmail}
      />

      <TypingInput
        label="Mot de passe"
        name="password"
        type="password"
        required
        value={password}
        setValue={setPassword}
      />
    </FormSection>
  );
}
