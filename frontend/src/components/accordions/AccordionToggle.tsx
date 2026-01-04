import { ReactNode } from "react";
import ChevronDown from "../../assets/svgs/ChevronDown";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../IconInlineText";

interface Props {
	label: ReactNode;
	open: boolean;
	setOpen: (value: boolean) => void;
}

export default function AccordionToggle({ label, open, setOpen }: Readonly<Props>) {

	const styles: CSS = {
		label: {
			display: "flex",
			flexDirection: "row",
			gap: "var(--xs-space)",
		},
		iconContainer: {
			justifyContent: "end",
		},
		icon: {
			transition: "transform var(--md-speed)",
			transform: open ? "rotate(180deg)" : "rotate(0deg)",
		},
	}

	return (
		<NoStyleButton onClick={() => setOpen(!open)}>
			<IconInlineText rightIcon={
				<div style={styles.icon}>
					<ChevronDown />
				</div>
			}>{label}</IconInlineText>
		</NoStyleButton>
	);
}
