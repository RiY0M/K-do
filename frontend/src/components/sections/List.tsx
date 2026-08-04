import CheckedList from "../list/CheckedList";
import UnCheckedList from "../list/UnCheckedList";
import Description from "../inputs/Description";
import { getMyCheckedItems, getMyUncheckedItems } from "../../services/items";
import { useEffect, useState } from "react";
import { Item } from "../../interfaces/item";

export default function List() {

	const [unCheckedItems, setUnCheckedItems] = useState<Item[]>([]);
	const [checkedItems, setCheckedItems] = useState<Item[]>([]);

	useEffect(() => {
		getMyUncheckedItems().then(setUnCheckedItems);
		getMyCheckedItems().then(setCheckedItems);
	}, []);

	return (
		<section>
			<div>
				<h1>Liste</h1>

				<Description />

				<UnCheckedList items={unCheckedItems} setItems={setUnCheckedItems} />

				{checkedItems &&
					<CheckedList items={checkedItems} />
				}
			</div>
		</section>
	);
}
