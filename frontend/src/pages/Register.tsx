import { useState, FormEvent } from "react";
import { registerAndSaveSession } from "../services/authStorage";
import { getOptionalUrl } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";
import FormSection from "../components/sections/FormSection";

export default function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const url = getOptionalUrl();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await registerAndSaveSession({
      name: name,
      email: email,
      password: password,
    }, url ? url : "/");
  };

  return (
    <FormSection
      title="Inscription"
      buttonLabel="S'inscrire"
      redirectMessage="Déjà inscrit ?"
      redirectLinkMessage="Se connecter"
      redirectUri={`/login/${url}`}
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
        label="E-mail"
        name="email"
        type="email"
        placeholder="k-do@exemple.com"
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
