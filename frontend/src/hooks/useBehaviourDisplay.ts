import { useSyncExternalStore } from "react";

// The value comes from the media queries of vars.css, so it is read again
// whenever the window is resized
const subscribe = (onChange: () => void) => {
	window.addEventListener("resize", onChange);
	return () => window.removeEventListener("resize", onChange);
};

const getSnapshot = () =>
	getComputedStyle(document.documentElement)
		.getPropertyValue("--behaviour-display")
		.trim();

export function useBehaviourDisplay() {
	return useSyncExternalStore(subscribe, getSnapshot);
}
