import { KeyboardEvent, PointerEvent, ReactNode, useRef, useState } from "react";
import { Kdo } from "../../interfaces/Kdo";
import Grip from "../../assets/svgs/Grip";
// import { markdownToPlainText } from "../../services/markdown"; // TODO markdown: put back later

interface Props {
	kdos: Kdo[];
	// New order of these Kdos, once a line is dropped somewhere else
	onReorder: (orderedIds: string[]) => void;
	// Renders a line; `dragHandle` goes wherever the line wants it
	renderKdo: (kdo: Kdo, dragHandle: ReactNode) => ReactNode;
}

interface DragState {
	id: string;
	fromIndex: number;
	startY: number;
	deltaY: number;
	// Vertical centers of the lines when the drag started
	centers: number[];
	// How far the other lines move to make room: dragged line + gap
	step: number;
}

/**
 * Lines that can be reordered by dragging their handle (pointer events, so it
 * works with a mouse and with a finger) or with the arrow keys once the
 * handle has the focus.
 */
export default function SortableKdos({
	kdos,
	onReorder,
	renderKdo,
}: Readonly<Props>) {

	const lineRefs = useRef(new Map<string, HTMLDivElement>());
	const handleRefs = useRef(new Map<string, HTMLButtonElement>());
	const [drag, setDrag] = useState<DragState | null>(null);

	// Where the dragged line would land: number of other lines above it
	const targetIndex = (state: DragState) => {
		const center = (state.centers[state.fromIndex] ?? 0) + state.deltaY;
		return state.centers.filter((other, index) => index !== state.fromIndex && other < center).length;
	};

	const moveTo = (fromIndex: number, toIndex: number) => {
		const ids = kdos.map((kdo) => kdo.id);
		const [id] = ids.splice(fromIndex, 1);
		if (id === undefined) return;
		ids.splice(toIndex, 0, id);
		onReorder(ids);
	};

	const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, kdo: Kdo, index: number) => {
		if (event.button !== 0) return;
		// No text selection nor scrolling while dragging
		event.preventDefault();

		const rects = kdos.map((line) => lineRefs.current.get(line.id)?.getBoundingClientRect());
		const own = rects[index];
		if (!own || rects.some((rect) => !rect)) return;

		const next = rects[index + 1];
		const previous = rects[index - 1];
		const gap = next ? next.top - own.bottom : previous ? own.top - previous.bottom : 0;

		event.currentTarget.setPointerCapture(event.pointerId);
		setDrag({
			id: kdo.id,
			fromIndex: index,
			startY: event.clientY,
			deltaY: 0,
			centers: rects.map((rect) => rect ? rect.top + rect.height / 2 : 0),
			step: own.height + gap,
		});
	};

	const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
		if (!drag) return;
		setDrag({ ...drag, deltaY: event.clientY - drag.startY });
	};

	const handlePointerUp = () => {
		if (!drag) return;
		const toIndex = targetIndex(drag);
		setDrag(null);
		if (toIndex !== drag.fromIndex) moveTo(drag.fromIndex, toIndex);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, kdo: Kdo, index: number) => {
		const toIndex = event.key === "ArrowUp" ? index - 1 : event.key === "ArrowDown" ? index + 1 : null;
		if (toIndex === null) return;
		event.preventDefault();
		if (toIndex < 0 || toIndex >= kdos.length) return;

		moveTo(index, toIndex);
		// Moving the line in the DOM can drop the focus: put it back
		requestAnimationFrame(() => handleRefs.current.get(kdo.id)?.focus());
	};

	const toIndex = drag ? targetIndex(drag) : null;

	return kdos.map((kdo, index) => {
		const isDragged = drag?.id === kdo.id;

		let offset = 0;
		if (drag && toIndex !== null) {
			if (isDragged) offset = drag.deltaY;
			else if (drag.fromIndex < index && index <= toIndex) offset = -drag.step;
			else if (toIndex <= index && index < drag.fromIndex) offset = drag.step;
		}

		const dragHandle = (
			<button
				type="button"
				className="action"
				ref={(element) => {
					if (element) handleRefs.current.set(kdo.id, element);
					else handleRefs.current.delete(kdo.id);
				}}
				style={{
					padding: 0,
					background: "transparent",
					boxShadow: "none",
					border: "none",
					display: "flex",
					cursor: isDragged ? "grabbing" : "grab",
					// Lets a finger drag the line instead of scrolling the page
					touchAction: "none",
				}}
				title="Glisser pour déplacer"
				// TODO markdown: markdownToPlainText(kdo.label).trim()
				aria-label={`Déplacer « ${kdo.label || "cadeau sans nom"} » (flèches haut et bas)`}
				onPointerDown={(event) => handlePointerDown(event, kdo, index)}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={() => setDrag(null)}
				onKeyDown={(event) => handleKeyDown(event, kdo, index)}
			>
				<Grip />
			</button>
		);

		return (
			<div
				key={kdo.id}
				ref={(element) => {
					if (element) lineRefs.current.set(kdo.id, element);
					else lineRefs.current.delete(kdo.id);
				}}
				style={{
					position: "relative",
					transform: offset ? `translateY(${offset}px)` : undefined,
					// The dragged line follows the pointer, the others slide
					transition: drag && !isDragged ? "transform var(--sm-speed)" : "none",
					zIndex: isDragged ? 1 : undefined,
					// Hides the lines it passes over
					background: isDragged ? "var(--mainer)" : undefined,
					boxShadow: isDragged ? "var(--shadow)" : undefined,
					borderRadius: isDragged ? "var(--sm-rounded-radius)" : undefined,
				}}
			>
				{renderKdo(kdo, dragHandle)}
			</div>
		);
	});
}
