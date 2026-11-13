import { FriendRequests, Friendship } from "../../interfaces/Friendship";
import { FriendOverview } from "../../interfaces/FriendOverview";
import { deleteFetch, getFetch, postFetch } from "./fetch";

const baseEndpoint = "/friend";

// With the news of each friend's list since I last opened it, and the gifts
// I took for them
export async function getFriends(): Promise<FriendOverview[]> {
    return await getFetch(`${baseEndpoint}/friends`);
}

export async function getFriendRequests(): Promise<FriendRequests> {
    return await getFetch(`${baseEndpoint}/requests`);
}

// If that person had already sent me a request, it is accepted instead
export async function sendFriendRequest(name: string): Promise<Friendship> {
    return await postFetch(`${baseEndpoint}/request`, {
        body: JSON.stringify({ name: name }),
    });
}

export async function acceptFriendRequest(id: string): Promise<Friendship> {
    return await postFetch(`${baseEndpoint}/accept/${id}`);
}

// Declines a received request, or cancels a sent one
export async function deleteFriendRequest(id: string): Promise<boolean> {
    return await deleteFetch(`${baseEndpoint}/request/${id}`);
}

export async function removeFriend(friendId: string): Promise<boolean> {
    return await deleteFetch(`${baseEndpoint}/${friendId}`);
}
