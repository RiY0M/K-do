import { useEffect, useState } from "react";

export function useBehaviourDisplay() {
	const [display, setDisplay] = useState<string>("");

	const readVar = () => {
		setDisplay(
			getComputedStyle(document.documentElement)
				.getPropertyValue("--behaviour-display")
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
