import { useState, FormEvent } from "react";
import { loginAndSaveSession } from "../services/authStorage";
import { getOptionalUrl } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";
import FormSection from "../components/sections/FormSection";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const url = getOptionalUrl();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await loginAndSaveSession({
      name: name,
      password: password,
    }, url ? url : "/");
  };

  return (
    <FormSection
      title="Connexion"
      buttonLabel="Se connecter"
      redirectMessage="Pas de compte ?"
      redirectLinkMessage="S'inscrire"
      redirectUri={`/register/${url}`}
      onSubmit={handleSubmit}
    >
      <TypingInput
        label="Nom"
        name="name"
        type="text"
        required
        value={name}
        setValue={setName}
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
