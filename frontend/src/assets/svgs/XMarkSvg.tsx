import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function XMarkSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6 18 18 6M6 6l12 12"
			/>
		</Svg>
	);
}
