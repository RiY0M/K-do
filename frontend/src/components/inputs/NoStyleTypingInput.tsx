import { ReactNode } from "react";
import { CSS } from "../../services/utils";

interface Props {
	label?: ReactNode;
	name: string;
	required?: boolean;
	value: string;
	setValue: (value: string) => void;
}

export default function NoStyleTypingInput({
	name,
	value,
	setValue,
}: Readonly<Props>) {

	const styles: CSS = {
		input: {
			border: "none",
			boxShadow: "none",
			padding: "0",
			backgroundColor: "transparent",
		}
	}

	return (
		<input
			style={styles.input}
			id={name}
			name={name}
			type="text"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			maxLength={255}
		/>
	);
}
