import { ReactNode, useState } from "react";
import AccordionToggle from "./AccordionToggle";
import AccordionContent from "./AccordionContent";

interface Props {
	label: ReactNode;
	leading?: ReactNode;
	defaultOpening?: boolean;
	preview?: boolean;
	children: ReactNode;
}

export default function FullAccordion({
	label,
	leading,
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

	return (
		<div className="no-gap">
			<div className="align-items-center row sm-gap space-between">
				<AccordionToggle open={open} setOpen={setOpen}>
					{label}
				</AccordionToggle>
				{leading}
			</div>

			<AccordionContent
				open={open}
				topSpace="sm"
				preview={preview}
			>
				{children}
			</AccordionContent>
		</div>
	);
}
