import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import EyeSvg from "../../assets/svgs/EyeSvg";
import EyeSlash from "../../assets/svgs/EyeSlashSvg";

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
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = "auto";
		const borders = textarea.offsetHeight - textarea.clientHeight;
		textarea.style.height = `${textarea.scrollHeight + borders}px`;
	}, [value, type]);
	const isPassword = type === "password";
	const iconSize = "1.4em";
	const iconSpace = "var(--sm-space)";

	const styles: CSS = {
		label: {
			cursor: "text",
			textAlign: "left",
		},
		hint: {
			textAlign: "left",
			opacity: 0.8,
		},
		textarea: {
			resize: "none",
			overflow: "hidden",
		},
		passwordInput: {
			// Leaves room for the show/hide button
			paddingRight: `calc(${iconSpace} * 2 + ${iconSize})`,
		},
		toggleButton: {
			right: iconSpace,
			top: "50%",
			transform: "translateY(-50%)",
		},
	}

	return (
		<div className="sm-gap">
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
					ref={textareaRef}
					value={value}
					style={styles.textarea}
					onChange={(e) => setValue(e.target.value)}
					onFocus={onFocus}
					onBlur={onBlur}
					maxLength={maxLength}
					rows={rows}
				/>
			}

			{type !== "textarea" &&
				<div className="relative">
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
							className="absolute flex"
							style={styles.toggleButton}
							title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeSlash size={iconSize} /> : <EyeSvg size={iconSize} />}
						</NoStyleButton>
					}
				</div>
			}

			{hint && <span style={styles.hint} className="sub-text">{hint}</span>}
		</div>
	);
}
