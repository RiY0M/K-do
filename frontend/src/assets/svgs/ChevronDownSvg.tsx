import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function ChevronDownSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="m19.5 8.25-7.5 7.5-7.5-7.5"
			/>
		</Svg>
	);
}
