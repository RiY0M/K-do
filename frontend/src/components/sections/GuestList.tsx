import CheckedList from "../CheckedList";
import UnCheckedList from "../UnCheckedList";
import { getCheckedItemsByUserId, getUncheckedItemsByUserId } from "../../services/items";
import { useEffect, useState } from "react";
import { Item } from "../../interfaces/item";
import FullAccordion from "../accordions/FullAccordion";

export default function GuestList() {

	const [unCheckedItems, setUnCheckedItems] = useState<Item[]>([]);
	const [checkedItems, setCheckedItems] = useState<Item[]>([]);

	const id = 1;
	const name = "test";
	const description = "description";

	useEffect(() => {
		getUncheckedItemsByUserId(id).then(setUnCheckedItems);
		getCheckedItemsByUserId(id).then(setCheckedItems);
	}, []);

	return (
		<section>
			<div>
				<h1>Liste de {name}</h1>

				<FullAccordion label="Description" defaultOpening>{description}</FullAccordion>

				<UnCheckedList items={unCheckedItems} setItems={setUnCheckedItems} />

				{checkedItems &&
					<CheckedList items={checkedItems} />
				}
			</div>
		</section>
	);
}
