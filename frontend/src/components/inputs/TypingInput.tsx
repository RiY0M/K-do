import { ReactNode } from "react";
import { CSS } from "../../services/utils";

type inputType = "text" | "link" | "email" | "number" | "password" | "textarea" | "search";

interface Props {
	label?: ReactNode;
	name: string;
	type?: inputType;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	pattern?: RegExp;
	value: string;
	setValue: (value: string) => void;
}

export default function TypingInput({
	label = "",
	name,
	type = "text",
	placeholder = "",
	required = false,
	disabled = false,
	pattern = /.*/g,
	value,
	setValue,
}: Readonly<Props>) {

	const styles: CSS = {
		div: {
			gap: "var(--xs-space)",
		},
		label: {
			cursor: "text",
			textAlign: "left",
		}
	}

	return (
		<div style={styles.div}>
			{label &&
				<label htmlFor={name} style={styles.label}>
					{label}
					{required && <span className="important"> *</span>}
				</label>
			}

			{type === "textarea" &&
				<textarea
					id={name}
					name={name}
					placeholder={placeholder}
					required={required}
					disabled={disabled}
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			}

			{type !== "textarea" &&
				<input
					id={name}
					name={name}
					type={type}
					placeholder={placeholder}
					required={required}
					disabled={disabled}
					// pattern={String(pattern)}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					maxLength={255}
				/>
			}
		</div>
	);
}
