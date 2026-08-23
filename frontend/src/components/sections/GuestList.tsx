import CheckedList from "../list/CheckedList";
import UnCheckedList from "../list/UnCheckedList";
import { useEffect, useState } from "react";
import FullAccordion from "../accordions/FullAccordion";
import { List } from "../../interfaces/list";
import { getListByFriendId } from "../../services/api/lists";

export default function GuestList() {

	const [list, setList] = useState<List | null>(null);

	useEffect(() => {
		getListByFriendId(1).then(setList);
	}, []);

	const name = "test";

	useEffect(() => {
		// getUncheckedItemsByUserId(id).then(setUnCheckedItems);
		// getCheckedItemsByUserId(id).then(setCheckedItems);
	}, []);

	return (
		<section>
			{!list && <h1>Chargement...</h1>}
			{list &&
				<div>
					<h1>Liste de&nbsp;: {name}</h1>

					<FullAccordion label="Description" defaultOpening>{list.description}</FullAccordion>

					<UnCheckedList items={list.uncheckedItems ?? []} />

					{list.checkedItems &&
						<><div></div>
							<CheckedList items={list.checkedItems} />
						</>
					}
				</div>
			}
		</section>
	);
}
