import { useState } from "react";
import { Link } from "react-router-dom";
import { loginAndSaveSession } from "../services/authStorage";
import { toUrlParam, useOptionalUrl } from "../services/utils";
import TypingInput from "../components/inputs/TypingInput";
import FormSection from "../components/sections/FormSection";

export default function Login() {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Page to go back to once logged in (e.g. an invitation)
  const url = useOptionalUrl();

  const handleSubmit = async () => {
    await loginAndSaveSession({
      name: name,
      password: password,
    }, url || "/");
  };

  return (
    <FormSection
      title="Connexion"
      buttonLabel="Se connecter"
      redirectMessage="Pas de compte ?"
      redirectLinkMessage="S'inscrire"
      redirectUri={`/register${toUrlParam(url)}`}
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

      <Link to="/forgot-password" style={{ fontSize: "var(--sm-size)" }}>
        Mot de passe oublié&nbsp;?
      </Link>
    </FormSection>
  );
}
