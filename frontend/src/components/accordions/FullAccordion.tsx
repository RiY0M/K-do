import { ReactNode, useEffect, useState } from "react";
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

	useEffect(() => {
		setOpen(defaultOpening);
	}, [defaultOpening]);

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
