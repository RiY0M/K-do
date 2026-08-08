import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { CSS } from "../../services/utils";

interface Props {
	open: boolean;
	preview?: boolean;
	children: ReactNode;
}

export default function AccordionContent({ open, preview = false, children }: Readonly<Props>) {
	const defaultHeight = preview ? 15 : 0;
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(defaultHeight);

	const updateHeight = () => {
		setHeight(ref.current!.scrollHeight);
	};

	useLayoutEffect(() => {
		if (!ref.current) return;

		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [open]);

	const styles: CSS = {
		container: {
			paddingTop: "var(--sm-space)",
			transition: "max-height var(--md-speed)",
			overflow: open && !preview ? "visible clip" : "hidden",
			maxHeight: open ? height : defaultHeight,
		},
	};

	return (
		<div ref={ref} style={styles.container}>
			{children}
		</div>
	);
}
