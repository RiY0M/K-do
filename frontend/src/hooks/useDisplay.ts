import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
	window.addEventListener("resize", onChange);
	return () => window.removeEventListener("resize", onChange);
};

const getCurrentDisplaySnapshot = () =>
	getComputedStyle(document.documentElement)
		.getPropertyValue("--current-display")
		.trim();

const getBehaviourDisplaySnapshot = () =>
	getComputedStyle(document.documentElement)
		.getPropertyValue("--behaviour-display")
		.trim();

export type currentDisplay = "small-mobile" | "mobile" | "tablet-portrait" | "tablet-landscape" | "laptop" | "desktop";
export type behaviourDisplay = "portrait" | "landscape";

export function useDisplay() {
	return {
		currentDisplay: useSyncExternalStore(subscribe, getCurrentDisplaySnapshot),
		behaviourDisplay: useSyncExternalStore(subscribe, getBehaviourDisplaySnapshot),
		isLandscape: "landscape" === useSyncExternalStore(subscribe, getBehaviourDisplaySnapshot),
	};
}
