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

	const uncheckedKdos = useMemo(() => kdos.filter((kdo) => !kdo.isChecked), [kdos]);
	const checkedKdos = useMemo(() => kdos.filter((kdo) => kdo.isChecked).sort(byPosition), [kdos]);

	return { setKdos, uncheckedKdos, checkedKdos, newKdoId, addKdo, updateKdo, removeKdo };
}
