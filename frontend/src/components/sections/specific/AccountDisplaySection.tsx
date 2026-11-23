import { Dispatch, SetStateAction, useEffect, useState } from "react";
import TypingInput from "../../inputs/TypingInput";
import FormSection from "../general/FormSection";
import { AccountInfo } from "../../../interfaces/AccountInfo";
import { updateMyAccount } from "../../../services/api/users";
import { updateCurrentUser } from "../../../services/authStorage";

interface Props {
	account?: AccountInfo | null;
	setAccount: Dispatch<SetStateAction<AccountInfo | null>>;
}

export default function AccountDisplaySection({
	account,
	setAccount,
}: Readonly<Props>) {

	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [confirmation, setConfirmation] = useState<string>("");
	const [currentPassword, setCurrentPassword] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		if (account) {
			setName(account.name);
			setEmail(account.email ?? "");
		}
	}, [account]);

	const emailChanged = account !== null && email.trim() !== (account!.email ?? "");
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
		updateCurrentUser({ name: updated.name });

		if (updated.undoEmailSentTo) {
			setMessage(`Un e-mail a été envoyé à ${updated.undoEmailSentTo} : il permet d'annuler ce changement pendant 7 jours. Vos autres appareils ont été déconnectés.`);
		} else if (wasSensitive) {
			setMessage("Vos autres appareils ont été déconnectés.");
		} else {
			setMessage("");
		}
	};

	return (
		<FormSection
			title="Mon compte"
			buttonLabel="Enregistrer"
			validatedLabel="Enregistré&nbsp;!"
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

					<p className="sub-text">
						{account?.email
							? `Un e-mail sera envoyé à votre adresse actuelle pour pouvoir annuler ce changement pendant 7 jours, au cas où ce ne serait pas vous.`
							: "Votre compte n'a pas d'e-mail : aucun e-mail d'annulation ne pourra être envoyé."}
						{" "}Vos autres appareils seront déconnectés.
					</p>
				</>
			}

			{message && <p className="sub-text">{message}</p>}
		</FormSection>
	);
}
