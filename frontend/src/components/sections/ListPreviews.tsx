import { List } from "../../interfaces/List";
import { getCurrentUser } from "../../services/authStorage";
import CopyLinkButton from "../buttons/CopyLinkButton";
import ListPreview from "../list/ListPreview";

interface Props {
	lists: List[];
}

export default function ListPreviews({
	lists,
}: Readonly<Props>) {

	const user = getCurrentUser();

	return (
		<section>
			<div>
				<h1>Groupe</h1>
				<CopyLinkButton userId={user!.id} />
				{lists.map(list => <ListPreview key={list.id} list={list} />)}
			</div>
		</section>
	);
}
