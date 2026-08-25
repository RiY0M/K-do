import CheckedList from "../list/CheckedList";
import UnCheckedList from "../list/UnCheckedList";
import Description from "../inputs/Description";
import { useEffect, useState } from "react";
import { List } from "../../interfaces/List";
import { getMyListDetail } from "../../services/api/lists";
import { CSS, listDisplayIdealWidth } from "../../services/utils";

interface Props {
	listPreview: List;
}

export default function ListDisplay({
	listPreview,
}: Readonly<Props>) {

	const [list, setList] = useState<List | null>(null);

	useEffect(() => {
		getMyListDetail(listPreview.id).then(setList);
	}, []);

	const styles: CSS = {
		section: {
			width: `min(${listDisplayIdealWidth}px, 100%)`,
		},
	};

	return (
		<section style={styles.section}>
			{!list && <h1>Chargement...</h1>}
			{list &&
				<div>
					<h1>{list.label ? list.label : "Liste"}</h1>

					<Description id={list.id} defaultDescription={list.description} />

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
