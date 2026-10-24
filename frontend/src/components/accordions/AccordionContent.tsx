import { ReactNode, TransitionEvent, useLayoutEffect, useRef, useState } from "react";
import { CSS } from "../../services/utils";

interface Props {
	open: boolean;
	preview?: boolean;
	children: ReactNode;
}

export default function AccordionContent({ open, preview = false, children }: Readonly<Props>) {
	const defaultHeight = preview ? 15 : 0;
	const contentRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(defaultHeight);
	// Fully opened (transition over): content can overflow, so that shadows
	// and nested accordions aren't cut
	const [isSettled, setIsSettled] = useState(open);
	const [wasOpen, setWasOpen] = useState(open);

	if (open !== wasOpen) {
		setWasOpen(open);
		if (!open) setIsSettled(false);
	}

	// The inner div is never height-constrained, so the observer also sees
	// its content grow (e.g. a nested accordion opening) - observing the
	// clipped container itself missed that.
	useLayoutEffect(() => {
		const content = contentRef.current;
		if (!content) return;

		const updateHeight = () => setHeight(content.offsetHeight);
		updateHeight();

		const observer = new ResizeObserver(updateHeight);
		observer.observe(content);

		return () => observer.disconnect();
	}, []);

	const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget && event.propertyName === "max-height" && open) {
			setIsSettled(true);
		}
	};

	const styles: CSS = {
		container: {
			transition: "max-height var(--md-speed)",
			overflow: open && isSettled && !preview ? "visible" : "hidden",
			maxHeight: open ? height : defaultHeight,
		},
		content: {
			paddingTop: "var(--sm-space)",
		},
	};

	return (
		<div style={styles.container} onTransitionEnd={handleTransitionEnd}>
			<div ref={contentRef} style={styles.content}>
				{children}
			</div>
		</div>
	);
}
