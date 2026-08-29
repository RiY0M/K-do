import MyCheckedList from "../list/me/MyCheckedList";
import MyUncheckedList from "../list/me/MyUncheckedList";
import Description from "../inputs/Description";
import { useEffect, useState } from "react";
import { List } from "../../interfaces/List";
import { getMyListDetail } from "../../services/api/lists";
import { CSS, listSectionActualWidth } from "../../services/utils";

interface Props {
	listPreview: List;
}

export default function MyFullListSection({
	listPreview,
}: Readonly<Props>) {

	const [list, setList] = useState<List | null>(null);

	useEffect(() => {
		getMyListDetail(listPreview.id).then(setList);
	}, []);

	const styles: CSS = {
		section: {
			width: listSectionActualWidth,
		},
	};

	return (
		<section style={styles.section}>
			{!list && <h1>Chargement...</h1>}
			{list &&
				<div>
					<h1>Liste</h1>

					<Description id={list.id} defaultDescription={list.description} />

					<MyUncheckedList kdos={list.uncheckedKdos ?? []} listId={list.id} />

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
