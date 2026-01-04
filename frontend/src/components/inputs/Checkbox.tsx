interface Props {
	name: string;
	required?: boolean;
	disabled?: boolean;
	checked?: boolean;
	setChecked: (value: boolean) => void;
}

export default function Checkbox({
	name,
	required = false,
	disabled = false,
	checked = false,
	setChecked,
}: Readonly<Props>) {

	return (
		<input
			id={name}
			name={name}
			type="checkbox"
			required={required}
			disabled={disabled}
			checked={checked}
			onChange={() => setChecked(!checked)}
		/>
	);
}
