import { useBehaviourDisplay } from "../../hooks/useBehaviourDisplay";
import FullAccordion from "../accordions/FullAccordion";
import FullPreviewAccordion from "../accordions/FullPreviewAccordion";

function GroupsBody() {
	return (
		<>
			<FullPreviewAccordion
				label="Famille"
				preview={<span>Anton<br />Elouan<br />Papa</span>}
			>
				<div><span>Anton<br />Elouan<br />Papa<br />Maman<br />test</span></div>
			</FullPreviewAccordion>

			<FullPreviewAccordion
				label="Potes"
				preview={<span>test</span>}
			>
				<div>Contenu</div>
			</FullPreviewAccordion></>
	);
}

export default function Groups() {

	const behaviourDisplay = useBehaviourDisplay();
	const behaviourLandscape = behaviourDisplay === "landscape";

	return (
		<section>
			{behaviourLandscape ?
				<div><h1>Groupes</h1><GroupsBody /></div>
				:
				<FullAccordion label={<h3>Groupes</h3>}>
					<GroupsBody />
				</FullAccordion>
			}
		</section>
	);
}
