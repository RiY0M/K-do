import { ReactNode } from "react";
import { CSS } from "../../services/utils";

interface Props {
	label?: ReactNode;
	name: string;
	required?: boolean;
	value: string;
	setValue: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
}

export default function NoStyleTypingInput({
	name,
	value,
	setValue,
	onFocus,
	onBlur,
}: Readonly<Props>) {

	const styles: CSS = {
		input: {
			border: "none",
			boxShadow: "none",
			padding: 0,
			backgroundColor: "transparent",
			resize: "none",
			overflow: "hidden",
			width: "100%",
			wordBreak: "break-word",
			whiteSpace: "pre-wrap",
		}
	}

	return (
		<textarea
			style={styles.input}
			id={name}
			name={name}
			value={value}
			onChange={(e) => {
				setValue(e.target.value);
				e.target.style.height = "auto";
				e.target.style.height = `${e.target.scrollHeight}px`;
			}}
			onFocus={onFocus}
			onBlur={onBlur}
			maxLength={255}
			rows={1}
		/>
	);
}
