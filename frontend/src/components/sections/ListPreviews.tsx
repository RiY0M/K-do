import { useBehaviourDisplay } from "../../hooks/useBehaviourDisplay";
import { List } from "../../interfaces/List";
import { getCurrentUser } from "../../services/authStorage";
import { CSS, groupSectionActualWidth, listSectionActualWidth } from "../../services/utils";
import CopyLinkButton from "../buttons/CopyLinkButton";
import ListPreview from "../list/ListPreview";

interface Props {
	lists: List[];
}

export default function ListPreviews({
	lists,
}: Readonly<Props>) {

	const behaviourDisplay = useBehaviourDisplay();
	const isLandscape = behaviourDisplay === "landscape";

	const user = getCurrentUser();

	const styles: CSS = {
		section: {
			width: isLandscape ? groupSectionActualWidth : listSectionActualWidth,
		},
	};

	return (
		<section style={styles.section}>
			<div>
				<h1>Groupe</h1>
				<CopyLinkButton userId={user!.id} />
				{lists.map(list => <ListPreview key={list.id} list={list} />)}
			</div>
		</section>
	);
}
