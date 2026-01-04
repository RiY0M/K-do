import { ReactNode, useState } from "react";
import AccordionToggle from "./AccordionToggle";
import AccordionContent from "./AccordionContent";
import { CSS } from "../../services/utils";

interface Props {
	label: ReactNode;
	preview: ReactNode;
	children: ReactNode;
}

export default function FullPreviewAccordion({ label, preview, children }: Readonly<Props>) {

	const [open, setOpen] = useState(false);

	const styles: CSS = {
		div: {
			gap: 0,
		},
	}

	return (
		<div style={styles.div}>
			<AccordionToggle label={label} open={open} setOpen={setOpen} />
			<AccordionContent open={!open}>{preview}</AccordionContent>
			<AccordionContent open={open}>{children}</AccordionContent>
		</div>
	);
}
