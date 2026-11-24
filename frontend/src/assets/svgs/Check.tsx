import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function CheckSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m4.5 12.75 6 6 9-13.5"
			/>
		</Svg>
	);
}
