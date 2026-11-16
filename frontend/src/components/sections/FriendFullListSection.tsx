import { useCallback, useEffect, useState } from "react";
import FriendCheckedList from "../list/friend/FriendCheckedList";
import FriendUncheckedList from "../list/friend/FriendUncheckedList";
import FullAccordion from "../accordions/FullAccordion";
import { List } from "../../interfaces/List";
import { getListByFriendId } from "../../services/api/lists";
import { useParams } from "react-router-dom";
import { getUsername } from "../../services/api/users";
import { useKdos } from "../../hooks/useKdos";
import { CSS } from "../../services/utils";
// import { markdownToPlainText } from "../../services/markdown"; // TODO markdown: put back later
import { Kdo } from "../../interfaces/Kdo";
import { getCurrentUser } from "../../services/authStorage";

export default function FriendFullListSection() {

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [list, setList] = useState<List | null>(null);
	const [username, setUsername] = useState<string>("");
	/**
	 * "Éléments cochés" of a friend's list only holds:
	 * - what the list's owner checked themselves (shown checked and disabled,
	 *   see FriendCheckLine);
	 * - what I took;
	 * - free gifts their creator checked (unchanged).
	 * A gift only taken by someone else stays in the main part.
	 */
	const myId = getCurrentUser()?.id;
	const isInCheckedPart = useCallback(
		(kdo: Kdo) => !!kdo.isChecked || (kdo.takenBy ?? []).some((user) => user.id === myId),
		[myId]
	);
	const { setKdos, uncheckedKdos, checkedKdos, newKdoId, addKdo, updateKdo, removeKdo } = useKdos(isInCheckedPart);

	// Same param name as the route in App.tsx (/friend/:userId)
	const { userId } = useParams();

	useEffect(() => {
		if (!userId) return;
		let ignore = false;

		Promise.all([getListByFriendId(userId), getUsername(userId)])
			.then(([friendList, friendName]) => {
				if (ignore) return;
				setList(friendList);
				setKdos([...(friendList.uncheckedKdos ?? []), ...(friendList.checkedKdos ?? [])]);
				setUsername(friendName);
			})
			.catch(console.error)
			.finally(() => {
				if (!ignore) setIsLoading(false);
			});

		return () => { ignore = true; };
	}, [userId, setKdos]);

	const styles: CSS = {
		description: {
			whiteSpace: "pre-wrap",
			overflowWrap: "anywhere",
		},
		deleted: {
			color: "var(--action)",
		},
	};

	const deletedKdos = list?.deletedKdos ?? [];

	return (
		<section>
			{isLoading && <h1>Chargement...</h1>}
			{!list && !isLoading && <h1>Erreur lors du chargement de la liste</h1>}
			{list && userId &&
				<div>
					<h1>Liste de&nbsp;: {username}</h1>

					{list.description.trim() &&
						<FullAccordion label="Commentaires" defaultOpening>
							<p style={styles.description}>{list.description}</p>
						</FullAccordion>
					}

					{/* Gone from the list, so marked here rather than on a line */}
					{deletedKdos.length > 0 &&
						<p style={styles.deleted} className="sub-text" title="Depuis votre dernière visite de cette liste">
							● {deletedKdos.length > 1 ? "Supprimés" : "Supprimé"}&nbsp;: {deletedKdos.map((kdo) => kdo.label.trim() || "Sans nom" /* TODO markdown: markdownToPlainText(kdo.label) */).join(", ")}
						</p>
					}

					<FriendUncheckedList
						friendId={userId}
						kdos={uncheckedKdos}
						newKdoId={newKdoId}
						onAdd={addKdo}
						onUpdate={updateKdo}
						onDelete={removeKdo}
					/>

					{checkedKdos.length > 0 &&
						<><div></div>
							<FriendCheckedList listAuthorId={userId} kdos={checkedKdos} onUpdate={updateKdo} onDelete={removeKdo} />
						</>
					}
				</div>
			}
		</section>
	);
}
