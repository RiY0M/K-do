import { useCallback, useEffect, useState } from "react";
import { useBehaviourDisplay } from "../../hooks/useBehaviourDisplay";
import { FriendRequests, Friendship } from "../../interfaces/Friendship";
import { User } from "../../interfaces/User";
import {
	acceptFriendRequest,
	deleteFriendRequest,
	getFriendRequests,
	getFriends,
	removeFriend,
	sendFriendRequest,
} from "../../services/api/friends";
import { CSS, groupSectionActualWidth, listSectionActualWidth } from "../../services/utils";
import FullAccordion from "../accordions/FullAccordion";
import MultiStateButton from "../buttons/MultiStateButton";
import FriendLine from "../friend/FriendLine";
import FriendRequestLine from "../friend/FriendRequestLine";
import TypingInput from "../inputs/TypingInput";
import ConfirmModal from "../modals/ConfirmModal";

interface Props {
	// Called when friends are added or removed (list members change too)
	onFriendsChange?: () => void;
}

export default function FriendsSection({
	onFriendsChange,
}: Readonly<Props>) {

	const behaviourDisplay = useBehaviourDisplay();
	const isLandscape = behaviourDisplay === "landscape";

	const [friends, setFriends] = useState<User[]>([]);
	const [requests, setRequests] = useState<FriendRequests>({ received: [], sent: [] });
	const [name, setName] = useState<string>("");
	const [friendToRemove, setFriendToRemove] = useState<User | null>(null);

	const loadFriends = useCallback(async () => {
		const [newFriends, newRequests] = await Promise.all([getFriends(), getFriendRequests()]);
		setFriends(newFriends);
		setRequests(newRequests);
	}, []);

	useEffect(() => {
		Promise.all([getFriends(), getFriendRequests()])
			.then(([newFriends, newRequests]) => {
				setFriends(newFriends);
				setRequests(newRequests);
			})
			.catch(console.error);
	}, []);

	const handleSend = async () => {
		const trimmedName = name.trim();
		if (!trimmedName) {
			throw new Error("Entrez un nom");
		}

		const friendship = await sendFriendRequest(trimmedName);
		setName("");
		await loadFriends();

		// They had already sent me a request: we are friends now
		if (friendship.status === "ACCEPTED") {
			onFriendsChange?.();
		}
	};

	const handleAccept = async (request: Friendship) => {
		try {
			await acceptFriendRequest(request.id);
			await loadFriends();
			onFriendsChange?.();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteRequest = async (request: Friendship) => {
		try {
			await deleteFriendRequest(request.id);
			await loadFriends();
		} catch (error) {
			console.error(error);
		}
	};

	// Removal waits for the confirmation modal
	const handleRemove = (friend: User) => setFriendToRemove(friend);

	const confirmRemove = async () => {
		if (!friendToRemove) return;

		// Errors are shown on the confirm button
		await removeFriend(friendToRemove.id);
		await loadFriends();
		onFriendsChange?.();
	};

	const styles: CSS = {
		section: {
			width: isLandscape ? groupSectionActualWidth : listSectionActualWidth,
		},
		form: {
			gap: "var(--sm-space)",
		},
		list: {
			gap: "var(--sm-space)",
		},
		empty: {
			fontSize: "var(--sm-size)",
		},
	};

	return (
		<section style={styles.section}>
			<div>
				<h1>Amis</h1>

				<form onSubmit={(event) => event.preventDefault()}>
					<div style={styles.form}>
						<TypingInput
							label="Ajouter un ami"
							name="friend-name"
							placeholder="Son nom sur K-do"
							maxLength={32}
							value={name}
							setValue={setName}
						/>
						<MultiStateButton onClick={handleSend} validatedLabel="Demande envoyée&nbsp;!">
							Envoyer demande
						</MultiStateButton>
					</div>
				</form>

				{requests.received.length > 0 &&
					<FullAccordion label={`Demandes reçues (${requests.received.length})`} defaultOpening={true}>
						<div style={styles.list}>
							{requests.received.map((request) => (
								<FriendRequestLine
									key={request.id}
									request={request}
									onAccept={handleAccept}
									onDelete={handleDeleteRequest}
								/>
							))}
						</div>
					</FullAccordion>
				}

				{requests.sent.length > 0 &&
					<FullAccordion label={`Demandes envoyées (${requests.sent.length})`}>
						<div style={styles.list}>
							{requests.sent.map((request) => (
								<FriendRequestLine
									key={request.id}
									request={request}
									onDelete={handleDeleteRequest}
								/>
							))}
						</div>
					</FullAccordion>
				}

				<FullAccordion label={`Mes amis (${friends.length})`} defaultOpening={true}>
					<div style={styles.list}>
						{friends.map((friend) => (
							<FriendLine key={friend.id} friend={friend} onRemove={handleRemove} />
						))}
						{friends.length === 0 &&
							<span style={styles.empty}>Pas encore d'amis : envoyez une demande ou partagez un lien d'invitation.</span>
						}
					</div>
				</FullAccordion>
			</div>

			{friendToRemove &&
				<ConfirmModal
					open
					title="Retirer cet ami ?"
					confirmLabel="Retirer"
					onConfirm={confirmRemove}
					onClose={() => setFriendToRemove(null)}
				>
					<p>
						Retirer <strong>{friendToRemove.name}</strong> de vos amis&nbsp;? Vous ne verrez plus vos listes
						respectives et vos réservations sur ses cadeaux seront annulées.
					</p>
				</ConfirmModal>
			}
		</section>
	);
}
