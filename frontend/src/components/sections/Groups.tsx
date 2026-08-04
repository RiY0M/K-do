import { useBehaviourDisplay } from "../../hooks/useBehaviourDisplay";
import { Group } from "../../interfaces/group";
import FullAccordion from "../accordions/FullAccordion";
import GroupBody from "../groups/GroupBody";

interface Props {
	groups: Group[];
}

export default function Groups({
	groups,
}: Readonly<Props>) {

	const behaviourDisplay = useBehaviourDisplay();
	const behaviourLandscape = behaviourDisplay === "landscape";

	return (
		<section>
			{behaviourLandscape ?
				<div>
					<h1>Groupes</h1>
					{groups.map(group => <GroupBody key={group.id} group={group} />)}
				</div>
				:
				<FullAccordion label={<h1>Groupes</h1>}>
					{groups.map(group => <GroupBody key={group.id} group={group} />)}
				</FullAccordion>
			}
		</section>
	);
}
