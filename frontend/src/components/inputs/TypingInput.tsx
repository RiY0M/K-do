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
	maxLength?: number;
	setValue: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
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
	maxLength,
	setValue,
	onFocus,
	onBlur,
}: Readonly<Props>) {

	const styles: CSS = {
		div: {
			gap: "var(--xs-space)",
		},
		label: {
			cursor: "text",
			textAlign: "left",
		},
		textarea: {
			resize: "none",
			overflow: "hidden",
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
					style={styles.textarea}
					onChange={(e) => {
						setValue(e.target.value);
						e.target.style.height = "auto";
						e.target.style.height = `${e.target.scrollHeight}px`;
					}}
					onFocus={onFocus}
					onBlur={onBlur}
					maxLength={maxLength}
					rows={4}
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
					onFocus={onFocus}
					onBlur={onBlur}
					maxLength={maxLength}
				/>
			}
		</div>
	);
}
