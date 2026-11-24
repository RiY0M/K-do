import { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";
import ChevronDownSvg from "../../assets/svgs/ChevronDownSvg";
import { CSS } from "../../services/utils";
import NoStyleButton from "../buttons/NoStyleButton";
import IconInlineText from "../statics/IconInlineText";

interface Props {
	children: ReactNode;
	dontShowIcon?: boolean;
	className?: string;
	style?: CSSProperties;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AccordionToggle({
	children,
	dontShowIcon = false,
	className = "",
	style,
	open,
	setOpen,
}: Readonly<Props>) {

	const styles: CSS = {
		iconContainer: {
			justifyContent: "end",
		},
		icon: {
			transition: "transform var(--md-speed)",
			transform: open ? "rotate(0deg)" : "rotate(180deg)",
		},
	}

	return (
		<NoStyleButton style={style} onClick={() => setOpen(!open)}>
			<IconInlineText className={className}>
				{!dontShowIcon &&
					<div style={styles.icon}>
						<ChevronDownSvg />
					</div>
				}
				{children}
			</IconInlineText>
		</NoStyleButton>
	);
}
