import { useState } from "react";
import TypingInput from "../inputs/TypingInput";
import CheckedList from "../CheckedList";
import UnCheckedList from "../UnCheckedList";

export default function List() {
	const [description, setDescription] = useState<string>("");

	const checkedElements = true;

	return (
		<section>
			<div>
				<h1>Liste</h1>

				<TypingInput
					label="Autres commentaires"
					name="description"
					type="textarea"
					value={description}
					setValue={setDescription}
				/>

				<UnCheckedList />

				{checkedElements &&
					<CheckedList />
				}
			</div>
		</section>
	);
}
