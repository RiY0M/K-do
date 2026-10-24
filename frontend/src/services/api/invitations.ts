import { Invitation } from "../../interfaces/Invitation";
import { getFetch, postFetch } from "./fetch";

const baseEndpoint = "/invitation";

export function getInvitationLink(invitation: Invitation): string {
    return `${window.location.origin}/invite/${invitation.id}`;
}

export async function createInvitation(listId: string): Promise<Invitation> {
    return await postFetch(`${baseEndpoint}/create/${listId}`);
}

export async function getInvitation(id: string): Promise<Invitation> {
    return await getFetch(`${baseEndpoint}/${id}`);
}

// Makes me a friend of the inviter, returns their id
export async function acceptInvitation(id: string): Promise<{ friendId: string }> {
    return await postFetch(`${baseEndpoint}/accept/${id}`);
}
