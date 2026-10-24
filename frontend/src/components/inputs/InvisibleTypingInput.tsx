import { useLayoutEffect, useRef } from "react";
import { CSS } from "../../services/utils";

interface Props {
	name: string;
	value: string;
	setValue: (value: string) => void;
	autoFocus?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
}

export default function InvisibleTypingInput({
	name,
	value,
	setValue,
	autoFocus = false,
	onFocus,
	onBlur,
}: Readonly<Props>) {
	const ref = useRef<HTMLTextAreaElement>(null);

	// Fits the height to the text, also on first render (long labels)
	useLayoutEffect(() => {
		const textarea = ref.current;
		if (!textarea) return;

		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;
	}, [value]);

	const styles: CSS = {
		input: {
			border: "none",
			boxShadow: "none",
			padding: 0,
			backgroundColor: "transparent",
			resize: "none",
			overflow: "hidden",
		}
	}

	return (
		<textarea
			ref={ref}
			style={styles.input}
			id={name}
			name={name}
			value={value}
			onChange={(e) => setValue(e.target.value)}
			autoFocus={autoFocus}
			onFocus={onFocus}
			onBlur={onBlur}
			maxLength={255}
			rows={1}
		/>
	);
}
