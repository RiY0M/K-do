import { getFetch, postFetch } from "./fetch";

export async function getUsername(userId: string) {
    return await getFetch(`/users/getUsername/${userId}`);
}

export async function acceptInvite(userId: string) {
    return await postFetch(`/users/acceptInvite/${userId}`);
}
