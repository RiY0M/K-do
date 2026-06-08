import CheckedList from "../CheckedList";
import UnCheckedList from "../UnCheckedList";
import Description from "../Description";
import { getCheckedItems, getUncheckedItems } from "../../services/items";
import { useEffect, useState } from "react";
import { Item } from "../../interfaces/item";

export default function List() {

	const [unCheckedItems, setUnCheckedItems] = useState<Item[]>([]);
	const [checkedItems, setCheckedItems] = useState<Item[]>([]);

	useEffect(() => {
		getUncheckedItems().then(setUnCheckedItems);
		getCheckedItems().then(setCheckedItems);
	}, []);

	return (
		<section>
			<div>
				<h1>Liste</h1>

				<Description />

				<UnCheckedList items={unCheckedItems} />

				{checkedItems &&
					<CheckedList items={checkedItems} />
				}
			</div>
		</section>
	);
}
