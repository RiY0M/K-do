import { useEffect, useState } from "react";
import MyCheckedList from "../list/me/MyCheckedList";
import FriendUncheckedList from "../list/friend/FriendUncheckedList";
import FullAccordion from "../accordions/FullAccordion";
import { List } from "../../interfaces/List";
import { getListByFriendId } from "../../services/api/lists";
import { useParams } from "react-router-dom";
import { getUsername } from "../../services/api/users";

export default function FriendFullListSection() {

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [list, setList] = useState<List | null>(null);
	const [username, setUsername] = useState<string>("");

	const { id } = useParams();

	useEffect(() => {
		getListByFriendId(id!).then(setList);
		getUsername(id!).then(setUsername)
		setIsLoading(false);
	}, []);

	return (
		<section>
			{isLoading && <h1>Chargement...</h1>}
			{!list && !isLoading && <h1>Erreur lors du chargement de la liste</h1>}
			{list &&
				<div>
					<h1>Liste de&nbsp;: {username}</h1>

					<FullAccordion label="Description" defaultOpening>{list.description}</FullAccordion>

					<FriendUncheckedList kdos={list.uncheckedKdos ?? []} />

					{list.checkedKdos &&
						<><div></div>
							<MyCheckedList kdos={list.checkedKdos} />
						</>
					}
				</div>
			}
		</section>
	);
}
