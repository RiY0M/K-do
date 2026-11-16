import { CSSProperties } from "react";

// Shared by EditableCheckLine and FriendCheckLine, Google Keep style: with a
// long label, the icons stay in front of its first two lines instead of
// moving to the middle of the whole text.
export const checkLineRow: CSSProperties = {
	// Every slot spans the row's height...
	alignItems: "stretch",
};

export const iconSlot: CSSProperties = {
	display: "flex",
	alignItems: "center",
	flexShrink: 0,
	// ...but never more than two lines: its icon is centered on those
	maxHeight: "2lh",
};
