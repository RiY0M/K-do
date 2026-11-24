import { SvgProps } from "../../interfaces/SvgProps";
import Svg from "./Svg";

export default function PlusSvg({ size }: Readonly<SvgProps>) {
	return (
		<Svg size={size}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 4.5v15m7.5-7.5h-15"
			/>
		</Svg>
	);
}
