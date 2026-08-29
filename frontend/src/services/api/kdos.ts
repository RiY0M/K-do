import { Kdo } from "../../interfaces/Kdo"

export async function createMyKdo(listId: number): Promise<Kdo> {
    // return await postFetch(`/kdo/me/create/${listId}`);
    return {
        id: 7,
        label: "Placeholder 7",
        position: 7,
    };
}

export async function createFriendKdo(): Promise<Kdo> {
    // return await postFetch("/kdo/friend/create");
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

export async function checkMyKdo(id: number): Promise<Kdo> {
    // return await patchFetch(`/kdo/me/check/${id}`, {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 7,
        label: "Placeholder 7",
        position: 7,
    };
}

export async function checkFriendKdo(id: number): Promise<Kdo> {
    // return await patchFetch(`/kdo/friend/check/${id}`, {
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
