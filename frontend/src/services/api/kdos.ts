import { Kdo } from "../../interfaces/Kdo"
import { deleteFetch, patchFetch, postFetch } from "./fetch";

const baseEndpoint = "/kdo";

export async function createMyKdo(listId: number): Promise<Kdo> {
    return await postFetch(`${baseEndpoint}/me/create/${listId}`);
}

export async function createFriendKdo(): Promise<Kdo> {
    return await postFetch(`${baseEndpoint}/friend/create`);
}

export async function updateKdoLabel(id: number, label: string): Promise<Kdo> {
    return await patchFetch(`${baseEndpoint}/updateLabel/${id}`, {
        body: JSON.stringify({ label: label }),
    });
}

export async function checkMyKdo(id: number, isChecked: boolean): Promise<Kdo> {
    return await patchFetch(`${baseEndpoint}/me/check/${id}`, {
        body: JSON.stringify({ isChecked: isChecked }),
    });
}

export async function checkFriendKdo(id: number, isChecked: boolean): Promise<Kdo> {
    return await patchFetch(`${baseEndpoint}/friend/check/${id}`, {
        body: JSON.stringify({ isChecked: isChecked }),
    });
}

export async function deleteKdo(id: number): Promise<boolean> {
    return await deleteFetch(`${baseEndpoint}/${id}`);
}
