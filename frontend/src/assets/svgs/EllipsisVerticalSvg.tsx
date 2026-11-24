import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function EllipsisVerticalSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size} fill>
			<circle cx="12" cy="5.5" r="1.75" />
			<circle cx="12" cy="12" r="1.75" />
			<circle cx="12" cy="18.5" r="1.75" />
		</Svg>
	);
}
