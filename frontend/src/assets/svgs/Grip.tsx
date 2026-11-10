interface Props {
	size?: number | string;
}

// Six dots: handle to drag a line
export default function Grip({ size = "1em" }: Readonly<Props>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
			<circle cx="9" cy="6" r="1.5" />
			<circle cx="15" cy="6" r="1.5" />
			<circle cx="9" cy="12" r="1.5" />
			<circle cx="15" cy="12" r="1.5" />
			<circle cx="9" cy="18" r="1.5" />
			<circle cx="15" cy="18" r="1.5" />
		</svg>
	);
}
