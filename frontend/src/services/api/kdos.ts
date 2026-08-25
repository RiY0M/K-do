import { Kdo } from "../../interfaces/Kdo"

export async function createKdo(listId: number): Promise<Kdo> {
    // return await postFetch("/kdo/create");
    return {
        id: 7,
        label: "Placeholder 7",
        position: 7,
    };
}

export async function updateKdoLabel(id: number, label: string): Promise<Kdo> {
    // return await patchFetch(`/kdo/updateLabel/${id}`, {
    //     body: JSON.stringify({ label: label }),
    // });
    return {
        id: 7,
        label: "Placeholder 7",
        position: 7,
    };
}

export async function checkKdo(id: number): Promise<Kdo> {
    // return await patchFetch(`/kdo/check/${id}`, {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 7,
        label: "Placeholder 7",
        position: 7,
    };
}

export async function deleteKdo(id: number): Promise<boolean> {
    // return await deleteFetch(`/kdo/${id}`);
    return true;
}
