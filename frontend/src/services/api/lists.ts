import { List } from "../../interfaces/List";
import { getFetch, postFetch, putFetch } from "./fetch";

const baseEndpoint = "/list";

export async function getMyListDetail(listId: number): Promise<List> {
    return await getFetch(`${baseEndpoint}/me/${listId}`);
    return {
        id: 1,
        label: "",
        description: "",
        position: 1,
        uncheckedKdos: [
            {
                id: 1,
                label: "Placeholder 1",
                position: 1,
            },
            {
                id: 2,
                label: "Placeholder 2",
                position: 2,
            },
            {
                id: 3,
                label: "Placeholder 3",
                position: 3,
            },
        ],
        checkedKdos: [
            {
                id: 4,
                label: "Placeholder 4",
                position: 4,
            },
            {
                id: 5,
                label: "Placeholder 5",
                position: 5,
            },
            {
                id: 6,
                label: "Placeholder 6",
                position: 6,
            },
        ],
    }
}

export async function getListByFriendId(friendId: string): Promise<List> {
    return await getFetch(`${baseEndpoint}/friend/${friendId}`);
    return {
        id: 1,
        label: "Tous",
        description: "",
        position: 1,
        uncheckedKdos: [
            {
                id: 1,
                label: "Placeholder 1",
                position: 1,
            },
            {
                id: 2,
                label: "Placeholder 2",
                position: 2,
            },
            {
                id: 3,
                label: "Placeholder 3",
                position: 3,
            },
        ],
        checkedKdos: [
            {
                id: 4,
                label: "Placeholder 4",
                position: 4,
            },
            {
                id: 5,
                label: "Placeholder 5",
                position: 5,
            },
            {
                id: 6,
                label: "Placeholder 6",
                position: 6,
            },
        ],
    }
}

export async function getMyLists(): Promise<List[]> {
    return await getFetch(`${baseEndpoint}/lists`);
    return [
        {
            id: 1,
            label: "Tous",
            description: "",
            position: 1,
            friends: [
                { id: "1", name: "Anton", isFriend: true },
                { id: "2", name: "Elouan", isFriend: true },
                { id: "3", name: "Papa", isFriend: true },
                { id: "4", name: "Maman", isFriend: true },
                { id: "5", name: "Moi", isFriend: true },
            ]
        },
    ];
}

export async function createList(label: string): Promise<List> {
    return postFetch(`${baseEndpoint}/create`, {
        body: JSON.stringify({ label: label }),
    });
}

export async function updateListDescription(id: number, description: string): Promise<List> {
    return await putFetch(`${baseEndpoint}/updateDescription/${id}`, {
        body: JSON.stringify({ description: description }),
    });
}
        
// TODO : ignore after this comment
// export async function deleteList(id: number): Promise<boolean> {
//     return true;
// }
