import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function GripSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size} fill>
			<circle cx="9" cy="6" r="1.5" />
			<circle cx="15" cy="6" r="1.5" />
			<circle cx="9" cy="12" r="1.5" />
			<circle cx="15" cy="12" r="1.5" />
			<circle cx="9" cy="18" r="1.5" />
			<circle cx="15" cy="18" r="1.5" />
		</Svg>
	);
}
