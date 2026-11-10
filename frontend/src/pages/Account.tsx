import { useEffect, useState } from "react";
import Header from "../components/navigation/Header";
import TypingInput from "../components/inputs/TypingInput";
import FormSection from "../components/sections/FormSection";
import { AccountInfo } from "../interfaces/AccountInfo";
import { getMyAccount, updateMyAccount } from "../services/api/users";
import { updateCurrentUser } from "../services/authStorage";
import { CSS } from "../services/utils";

export default function Account() {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmation, setConfirmation] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    getMyAccount()
      .then((loaded) => {
        setAccount(loaded);
        setName(loaded.name);
        setEmail(loaded.email ?? "");
      })
      .catch(console.error);
  }, []);

  const emailChanged = account !== null && email.trim() !== (account.email ?? "");
  // Same rule as the backend (AccountService.updateAccount)
  const needsCurrentPassword = emailChanged || newPassword !== "";

  const handleSubmit = async () => {
    if (!account) {
      throw new Error("Chargement du compte...");
    }
    if (name.trim().length < 2) {
      throw new Error("Nom : 2 caractères minimum");
    }
    if (newPassword && newPassword.length < 4) {
      throw new Error("Mot de passe : 4 caractères minimum");
    }
    if (newPassword !== confirmation) {
      throw new Error("Les mots de passe sont différents");
    }
    if (needsCurrentPassword && !currentPassword) {
      throw new Error("Entrez votre mot de passe actuel");
    }

    const wasSensitive = needsCurrentPassword;
    const updated = await updateMyAccount({
      name: name.trim(),
      email: email.trim(),
      newPassword: newPassword,
      currentPassword: currentPassword,
    });

    setAccount(updated);
    setName(updated.name);
    setEmail(updated.email ?? "");
    setNewPassword("");
    setConfirmation("");
    setCurrentPassword("");
    // The name shown elsewhere (taken by...) comes from the stored session
    updateCurrentUser({ name: updated.name });

    if (updated.undoEmailSentTo) {
      setMessage(`Un e-mail a été envoyé à ${updated.undoEmailSentTo} : il permet d'annuler ce changement pendant 7 jours. Vos autres appareils ont été déconnectés.`);
    } else if (wasSensitive) {
      setMessage("Vos autres appareils ont été déconnectés.");
    } else {
      setMessage("");
    }
  };

  const styles: CSS = {
    message: {
      fontSize: "var(--sm-size)",
    },
  };

  return (
    <>
      <Header forceHomeRedirect />
      <FormSection
        title="Mon compte"
        buttonLabel="Enregistrer"
        validatedLabel="Enregistré&nbsp;!"
        redirectMessage="Rien à changer ?"
        redirectLinkMessage="Retour à l'accueil"
        redirectUri="/"
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
          hint={account && !account.email ? "Sans e-mail, impossible de réinitialiser le mot de passe ni d'annuler un changement." : undefined}
          value={email}
          setValue={setEmail}
        />

        <TypingInput
          label="Nouveau mot de passe"
          name="new-password"
          type="password"
          hint="Laissez vide pour garder l'actuel"
          value={newPassword}
          setValue={setNewPassword}
        />

        {newPassword &&
          <TypingInput
            label="Confirmation"
            name="confirmation"
            type="password"
            required
            value={confirmation}
            setValue={setConfirmation}
          />
        }

        {needsCurrentPassword &&
          <>
            <TypingInput
              label="Mot de passe actuel"
              name="current-password"
              type="password"
              required
              value={currentPassword}
              setValue={setCurrentPassword}
            />

            <p style={styles.message}>
              {account?.email
                ? `Un e-mail sera envoyé à votre adresse actuelle pour pouvoir annuler ce changement pendant 7 jours, au cas où ce ne serait pas vous.`
                : "Votre compte n'a pas d'e-mail : aucun e-mail d'annulation ne pourra être envoyé."}
              {" "}Vos autres appareils seront déconnectés.
            </p>
          </>
        }

        {message && <p style={styles.message}>{message}</p>}
      </FormSection>
    </>
  );
}
