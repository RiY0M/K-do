import CheckedList from "../list/CheckedList";
import UnCheckedList from "../list/UnCheckedList";
import { useEffect, useState } from "react";
import FullAccordion from "../accordions/FullAccordion";
import { List } from "../../interfaces/List";
import { getListByFriendId } from "../../services/api/lists";
import { useParams } from "react-router-dom";
import { getUsername } from "../../services/api/users";

export default function GuestList() {

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

					<UnCheckedList kdos={list.uncheckedKdos ?? []} listId={list.id} />

					{list.checkedKdos &&
						<><div></div>
							<CheckedList kdos={list.checkedKdos} />
						</>
					}
				</div>
			}
		</section>
	);
}
