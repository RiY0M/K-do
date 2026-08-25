import { List } from "../../interfaces/List";

export async function getMyListDetail(listId: number): Promise<List> {
    // return await getFetch(`/list/me/${listId}`);
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
    // return await getFetch(`/list/friend/${friendId}`);
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
    // return await getFetch("/api/lists");
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
    return {
        id: 7,
        label: label,
        description: "",
        position: 1,
    };
}

export async function updateListDescription(id: number, description: string): Promise<List> {
    // return await putFetch(`/list/updateDescription/${id}`, {
    //     body: JSON.stringify({ description: description }),
    // });
    return {
        id: 7,
        label: "",
        description: description,
        position: 1,
    };
}
        
// TODO : ignore after this comment
// export async function deleteList(id: number): Promise<boolean> {
//     return true;
// }
