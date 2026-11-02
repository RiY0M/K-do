import { ReactNode, useState } from "react";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import Eye from "../../assets/svgs/Eye";
import EyeSlash from "../../assets/svgs/EyeSlash";

type inputType = "text" | "link" | "email" | "number" | "password" | "textarea" | "search";

interface Props {
	label?: ReactNode;
	name: string;
	type?: inputType;
	placeholder?: string;
	hint?: string;
	required?: boolean;
	disabled?: boolean;
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
	pattern = /^.*$/g,
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

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const isPassword = type === "password";
	const iconSize = "1.4em";
	const iconSpace = "var(--sm-space)";

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
		},
		inputWrapper: {
			position: "relative",
		},
		passwordInput: {
			// Leaves room for the show/hide button
			paddingRight: `calc(${iconSpace} * 2 + ${iconSize})`,
		},
		toggleButton: {
			position: "absolute",
			right: iconSpace,
			top: "50%",
			transform: "translateY(-50%)",
			display: "flex",
		},
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
				<div style={styles.inputWrapper}>
					<input
						id={name}
						name={name}
						type={isPassword && showPassword ? "text" : type}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						pattern={pattern.source}
						value={value}
						style={isPassword ? styles.passwordInput : undefined}
						onChange={(e) => setValue(e.target.value)}
						onFocus={onFocus}
						onBlur={onBlur}
						maxLength={maxLength}
					/>

					{isPassword &&
						<NoStyleButton
							style={styles.toggleButton}
							title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeSlash size={iconSize} /> : <Eye size={iconSize} />}
						</NoStyleButton>
					}
				</div>
			}

			{hint && <span style={styles.hint}>{hint}</span>}
		</div>
	);
}
