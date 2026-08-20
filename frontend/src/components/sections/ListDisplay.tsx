import CheckedList from "../list/CheckedList";
import UnCheckedList from "../list/UnCheckedList";
import Description from "../inputs/Description";
import { useEffect, useState } from "react";
import { List } from "../../interfaces/list";
import { getMyListByGroupId } from "../../services/lists";

export default function ListDisplay() {

	const [list, setList] = useState<List | null>(null);

	useEffect(() => {
		getMyListByGroupId(1).then(setList);
	}, []);

	return (
		<section>
			{!list && <h1>Chargement...</h1>}
			{list &&
				<div>
					<h1>Liste</h1>

					<Description />

					<UnCheckedList items={list.uncheckedItems} />

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
