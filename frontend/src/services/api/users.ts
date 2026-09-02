import { getFetch, postFetch } from "./fetch";

const baseEndpoint = "/user";

export async function getUsername(userId: string): Promise<string> {
    return await getFetch(`${baseEndpoint}/getUsername/${userId}`);
}

export async function acceptInvite(userId: string) {
    return await postFetch(`${baseEndpoint}/acceptInvite/${userId}`);
}
