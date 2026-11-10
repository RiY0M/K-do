import { useCallback, useMemo, useState } from "react";
import { Kdo, KdoUpdate } from "../interfaces/Kdo";

const byPosition = (a: Kdo, b: Kdo) => a.position - b.position;

/**
 * Keeps the Kdos of a list in state, so that adding, editing, checking or
 * deleting one updates the page right away (checked ones move to the
 * "Éléments cochés" part).
 */
export function useKdos() {
	const [kdos, setKdos] = useState<Kdo[]>([]);
	// Last created Kdo, focused so its label can be typed right away
	const [newKdoId, setNewKdoId] = useState<string | null>(null);

	const addKdo = useCallback((kdo: Kdo) => {
		setKdos((previous) => [...previous, kdo]);
		setNewKdoId(kdo.id);
	}, []);

	const updateKdo = useCallback((update: KdoUpdate) => {
		setKdos((previous) => previous.map((kdo) => kdo.id === update.id ? { ...kdo, ...update } : kdo));
	}, []);

	const removeKdo = useCallback((id: string) => {
		setKdos((previous) => previous.filter((kdo) => kdo.id !== id));
	}, []);

	/**
	 * Puts the Kdos of one part of the list (checked or unchecked) in the
	 * given order. Positions are shared by both parts, so this part keeps the
	 * slots it had among the others, then everything is renumbered 1..n.
	 * Returns the whole list's new order (to save it) and the previous Kdos
	 * (to roll back if saving fails).
	 */
	const reorderKdos = useCallback((orderedIds: string[]) => {
		const byId = new Map(kdos.map((kdo) => [kdo.id, kdo]));
		const part = new Set(orderedIds);
		let next = 0;

		const reordered = [...kdos]
			.sort(byPosition)
			.map((kdo) => part.has(kdo.id) ? (byId.get(orderedIds[next++] ?? "") ?? kdo) : kdo)
			.map((kdo, index) => ({ ...kdo, position: index + 1 }));

		setKdos(reordered);
		return { previous: kdos, orderedIds: reordered.map((kdo) => kdo.id) };
	}, [kdos]);

	const uncheckedKdos = useMemo(() => kdos.filter((kdo) => !kdo.isChecked).sort(byPosition), [kdos]);
	const checkedKdos = useMemo(() => kdos.filter((kdo) => kdo.isChecked).sort(byPosition), [kdos]);

	return { setKdos, uncheckedKdos, checkedKdos, newKdoId, addKdo, updateKdo, removeKdo, reorderKdos };
}
