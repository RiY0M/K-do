interface Props {
	size?: number | string;
}

export default function Plus({ size = "1em" }: Readonly<Props>) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>

	);
}
