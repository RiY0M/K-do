import MyCheckedList from "../list/me/MyCheckedList";
import MyUncheckedList from "../list/me/MyUnCheckedList";
import Description from "../inputs/Description";
import { useEffect, useState } from "react";
import { List } from "../../interfaces/List";
import { getMyListDetail } from "../../services/api/lists";
import { CSS, listSectionActualWidth } from "../../services/utils";
import { useKdos } from "../../hooks/useKdos";

interface Props {
	listPreview: List;
}

export default function MyFullListSection({
	listPreview,
}: Readonly<Props>) {

	const [list, setList] = useState<List | null>(null);
	const [hasError, setHasError] = useState<boolean>(false);
	const { setKdos, uncheckedKdos, checkedKdos, newKdoId, addKdo, updateKdo, removeKdo } = useKdos();

	useEffect(() => {
		let ignore = false;

		getMyListDetail(listPreview.id)
			.then((detail) => {
				if (ignore) return;
				setList(detail);
				setKdos([...(detail.uncheckedKdos ?? []), ...(detail.checkedKdos ?? [])]);
			})
			.catch(() => {
				if (!ignore) setHasError(true);
			});

		return () => { ignore = true; };
	}, [listPreview.id, setKdos]);

	const styles: CSS = {
		section: {
			width: listSectionActualWidth,
		},
	};

	return (
		<section style={styles.section}>
			{!list && !hasError && <h1>Chargement...</h1>}
			{!list && hasError && <h1>Erreur lors du chargement de la liste</h1>}
			{list &&
				<div>
					<h1>Liste</h1>

					<Description key={list.id} id={list.id} defaultDescription={list.description} />

					<MyUncheckedList
						listId={list.id}
						kdos={uncheckedKdos}
						newKdoId={newKdoId}
						onAdd={addKdo}
						onUpdate={updateKdo}
						onDelete={removeKdo}
					/>

					{checkedKdos.length > 0 &&
						<><div></div>
							<MyCheckedList kdos={checkedKdos} onUpdate={updateKdo} onDelete={removeKdo} />
						</>
					}
				</div>
			}
		</section>
	);
}
