import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function ArrowLeftSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
			/>
		</Svg>
	);
}
