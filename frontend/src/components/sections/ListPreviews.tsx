import { useBehaviourDisplay } from "../../hooks/useBehaviourDisplay";
import { List } from "../../interfaces/list";
import FullAccordion from "../accordions/FullAccordion";
import ListPreview from "../list/ListPreview";

interface Props {
	lists: List[];
}

export default function ListPreviews({
	lists,
}: Readonly<Props>) {

	const behaviourDisplay = useBehaviourDisplay();
	const behaviourLandscape = behaviourDisplay === "landscape";

	return (
		<section>
			{behaviourLandscape ?
				<div>
					<h1>Listes</h1>
					{lists.map(list => <ListPreview key={list.id} list={list} />)}
				</div>
				:
				<FullAccordion label={<h1>Listes</h1>}>
					{lists.map(list => <ListPreview key={list.id} list={list} />)}
				</FullAccordion>
			}
		</section>
	);
}
