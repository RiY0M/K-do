import { useEffect, useState } from "react";

export function useCurrentDisplay() {
	const [display, setDisplay] = useState<string>("");

	const readVar = () => {
		setDisplay(
			getComputedStyle(document.documentElement)
				.getPropertyValue("--current-display")
				.trim()
		);
	};

	useEffect(() => {
		readVar();
		window.addEventListener("resize", readVar);

		return () => window.removeEventListener("resize", readVar);
	}, []);

	return display;
}
