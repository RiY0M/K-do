import { useDisplay } from "../../../hooks/useDisplay";
import { AccountInfo, NotificationSettings } from "../../../interfaces/AccountInfo";
import { updateMyNotifications } from "../../../services/api/users";
import { CSS, smSectionActualWidth } from "../../../services/utils";
import Checkbox from "../../inputs/Checkbox";
import IconInlineText from "../../statics/IconInlineText";
import { Dispatch, SetStateAction } from "react";

const notificationOptions: { key: keyof NotificationSettings; label: string }[] = [
	{ key: "added", label: "Cadeaux ajoutés" },
	{ key: "edited", label: "Cadeaux modifiés" },
	{ key: "deleted", label: "Cadeaux supprimés" },
	{ key: "taken", label: "Cadeaux pris par quelqu'un" },
];

interface Props {
	account?: AccountInfo | null;
	setAccount: Dispatch<SetStateAction<AccountInfo | null>>;
}

export default function NotificationsSection({
	account,
	setAccount,
}: Readonly<Props>) {

	const { isLandscape } = useDisplay();

	const toggleNotification = async (key: keyof NotificationSettings, value: boolean) => {
		if (!account) return;
		const previous = account.notifications;
		setAccount({ ...account, notifications: { ...previous, [key]: value } });

		try {
			const notifications = await updateMyNotifications({ [key]: value });
			setAccount({ ...account, notifications });
		} catch (error) {
			console.error(error);
			setAccount({ ...account, notifications: previous });
		}
	};

	const styles: CSS = {
		section: {
			width: isLandscape ? smSectionActualWidth : "100%",
		},
	};

	return (
		<section style={styles.section}>
			<div>
				<h2>Notifications</h2>
				<div className="sm-gap">

					{notificationOptions.map((option) => (
						<IconInlineText key={option.key}>
							<Checkbox
								name={`notify-${option.key}`}
								checked={account!.notifications[option.key]}
								setChecked={(value) => toggleNotification(option.key, value)}
							/>
							<label htmlFor={`notify-${option.key}`}>{option.label}</label>
						</IconInlineText>
					))}
				</div>
			</div>
		</section>
	);
}
