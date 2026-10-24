import { ReactNode, useState } from "react";
import AccordionToggle from "./AccordionToggle";
import AccordionContent from "./AccordionContent";
import { CSS } from "../../services/utils";

interface Props {
	label: ReactNode;
	defaultOpening?: boolean;
	preview?: boolean;
	children: ReactNode;
}

export default function FullAccordion({
	label,
	defaultOpening = false,
	preview = false,
	children
}: Readonly<Props>) {

	const [open, setOpen] = useState(defaultOpening);
	const [previousDefaultOpening, setPreviousDefaultOpening] = useState(defaultOpening);

	// Follows defaultOpening when it changes (adjusted during render rather
	// than in an effect, see https://react.dev/learn/you-might-not-need-an-effect)
	if (defaultOpening !== previousDefaultOpening) {
		setPreviousDefaultOpening(defaultOpening);
		setOpen(defaultOpening);
	}

	const styles: CSS = {
		div: {
			gap: 0,
		},
	}

	return (
		<div style={styles.div}>
			<AccordionToggle label={label} open={open} setOpen={setOpen} />
			<AccordionContent open={open} preview={preview}>{children}</AccordionContent>
		</div>
	);
}
