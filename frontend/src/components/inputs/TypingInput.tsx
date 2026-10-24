import { ReactNode } from "react";
import { CSS } from "../../services/utils";

type inputType = "text" | "link" | "email" | "number" | "password" | "textarea" | "search";

interface Props {
	label?: ReactNode;
	name: string;
	type?: inputType;
	placeholder?: string;
	// Small text under the field
	hint?: string;
	required?: boolean;
	disabled?: boolean;
	// Not applied for now (see the commented `pattern` attribute below)
	pattern?: RegExp;
	value: string;
	maxLength?: number;
	rows?: number;
	setValue: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
}

export default function TypingInput({
	label = "",
	name,
	type = "text",
	placeholder = "",
	hint,
	required = false,
	disabled = false,
	value,
	maxLength,
	rows = 1,
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
		hint: {
			fontSize: "var(--sm-size)",
			textAlign: "left",
			opacity: 0.8,
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
					rows={rows}
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

			{hint && <span style={styles.hint}>{hint}</span>}
		</div>
	);
}
