import { List } from "../../interfaces/List";
import { getFetch, postFetch, putFetch } from "./fetch";

const baseEndpoint = "/list";

export async function getMyListDetail(listId: string): Promise<List> {
    return await getFetch(`${baseEndpoint}/me/${listId}`);
}

export async function getListByFriendId(friendId: string): Promise<List> {
    return await getFetch(`${baseEndpoint}/friend/${friendId}`);
}

// My own lists, with their members. The backend creates the default list
// ("Tous") if needed, so this is never empty.
export async function getMyLists(): Promise<List[]> {
    return await getFetch(`${baseEndpoint}/lists`);
}

export async function createList(label: string): Promise<List> {
    return postFetch(`${baseEndpoint}/create`, {
        body: JSON.stringify({ label: label }),
    });
}

export async function updateListDescription(id: string, description: string): Promise<List> {
    return await putFetch(`${baseEndpoint}/updateDescription/${id}`, {
        body: JSON.stringify({ description: description }),
    });
}

// TODO : ignore after this comment
// export async function deleteList(id: string): Promise<boolean> {
//     return true;
// }
