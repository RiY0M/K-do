interface Props {
	size?: number | string;
}

// Three vertical dots: opens a menu of actions
export default function EllipsisVertical({ size = "1em" }: Readonly<Props>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width={size} height={size}>
			<circle cx="12" cy="5.5" r="1.75" />
			<circle cx="12" cy="12" r="1.75" />
			<circle cx="12" cy="18.5" r="1.75" />
		</svg>
	);
}
