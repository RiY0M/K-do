import { useBehaviourDisplay } from "../../hooks/useBehaviourDisplay";
import { List } from "../../interfaces/List";
import { CSS, smSectionActualWidth, lgSectionActualWidth } from "../../services/utils";
import ListPreview from "../list/ListPreview";

interface Props {
	lists: List[];
}

export default function ListPreviews({
	lists,
}: Readonly<Props>) {

	const behaviourDisplay = useBehaviourDisplay();
	const isLandscape = behaviourDisplay === "landscape";

	const styles: CSS = {
		section: {
			width: isLandscape ? smSectionActualWidth : lgSectionActualWidth,
		},
	};

	return (
		<section style={styles.section}>
			<div>
				<h1>Groupe</h1>
				{lists.map(list => <ListPreview key={list.id} list={list} />)}
			</div>
		</section>
	);
}
