import { List } from "../interfaces/list";

export async function getMyListByGroupId(groupId: number): Promise<List> {
    // return await getFetch("/list/me/groupId", {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 1,
        description: "",
        uncheckedItems: [
            {
                id: 1,
                value: "Placeholder 1",
                position: 1,
            },
            {
                id: 2,
                value: "Placeholder 2",
                position: 2,
            },
            {
                id: 3,
                value: "Placeholder 3",
                position: 3,
            },
        ],
        checkedItems: [
            {
                id: 4,
                value: "Placeholder 4",
                position: 4,
            },
            {
                id: 5,
                value: "Placeholder 5",
                position: 5,
            },
            {
                id: 6,
                value: "Placeholder 6",
                position: 6,
            },
        ],
    }
}

export async function getListByFriendId(friendId: number): Promise<List> {
    // return await getFetch("/list/friendId", {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 1,
        description: "",
        uncheckedItems: [
            {
                id: 1,
                value: "Placeholder 1",
                position: 1,
            },
            {
                id: 2,
                value: "Placeholder 2",
                position: 2,
            },
            {
                id: 3,
                value: "Placeholder 3",
                position: 3,
            },
        ],
        checkedItems: [
            {
                id: 4,
                value: "Placeholder 4",
                position: 4,
            },
            {
                id: 5,
                value: "Placeholder 5",
                position: 5,
            },
            {
                id: 6,
                value: "Placeholder 6",
                position: 6,
            },
        ],
    }
}
