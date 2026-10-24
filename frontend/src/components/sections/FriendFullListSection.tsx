import { useEffect, useState } from "react";
import FriendCheckedList from "../list/friend/FriendCheckedList";
import FriendUncheckedList from "../list/friend/FriendUncheckedList";
import FullAccordion from "../accordions/FullAccordion";
import { List } from "../../interfaces/List";
import { getListByFriendId } from "../../services/api/lists";
import { useParams } from "react-router-dom";
import { getUsername } from "../../services/api/users";
import { useKdos } from "../../hooks/useKdos";
import { CSS } from "../../services/utils";

export default function FriendFullListSection() {

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [list, setList] = useState<List | null>(null);
	const [username, setUsername] = useState<string>("");
	const { setKdos, uncheckedKdos, checkedKdos, newKdoId, addKdo, updateKdo, removeKdo } = useKdos();

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
	};

	return (
		<section>
			{isLoading && <h1>Chargement...</h1>}
			{!list && !isLoading && <h1>Erreur lors du chargement de la liste</h1>}
			{list && userId &&
				<div>
					<h1>Liste de&nbsp;: {username}</h1>

					{list.description &&
						<FullAccordion label="Description" defaultOpening>
							<p style={styles.description}>{list.description}</p>
						</FullAccordion>
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
							<FriendCheckedList kdos={checkedKdos} onUpdate={updateKdo} onDelete={removeKdo} />
						</>
					}
				</div>
			}
		</section>
	);
}
