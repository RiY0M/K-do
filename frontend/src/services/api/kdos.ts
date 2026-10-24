import { Kdo } from "../../interfaces/Kdo"
import { deleteFetch, patchFetch, postFetch } from "./fetch";

const baseEndpoint = "/kdo";

export async function createMyKdo(listId: string): Promise<Kdo> {
    return await postFetch(`${baseEndpoint}/me/create/${listId}`);
}

// Surprise idea for a friend: visible on their page by everyone but them
export async function createFriendKdo(friendId: string): Promise<Kdo> {
    return await postFetch(`${baseEndpoint}/friend/create`, {
        body: JSON.stringify({ friendId: friendId }),
    });
}

export async function updateKdoLabel(id: string, label: string): Promise<Kdo> {
    return await patchFetch(`${baseEndpoint}/updateLabel/${id}`, {
        body: JSON.stringify({ label: label }),
    });
}

export async function checkMyKdo(id: string, isChecked: boolean): Promise<Kdo> {
    return await patchFetch(`${baseEndpoint}/me/check/${id}`, {
        body: JSON.stringify({ isChecked: isChecked }),
    });
}

export async function checkFriendKdo(id: string, isChecked: boolean): Promise<Kdo> {
    return await patchFetch(`${baseEndpoint}/friend/check/${id}`, {
        body: JSON.stringify({ isChecked: isChecked }),
    });
}

export async function deleteKdo(id: string): Promise<boolean> {
    return await deleteFetch(`${baseEndpoint}/${id}`);
}
