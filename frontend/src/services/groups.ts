import { Group } from "../interfaces/group"

export async function getMyGroups(): Promise<Group[]> {
    // return await getFetch("/groups", {
    //     body: JSON.stringify(payload),
    //   });
    return [
        {
            id: 1,
            label: "Tous",
            position: 1,
            friends: [
                { id: 1, name: "Anton", isFriend: true },
                { id: 2, name: "Elouan", isFriend: true },
                { id: 3, name: "Papa", isFriend: true },
                { id: 4, name: "Maman", isFriend: true },
                { id: 5, name: "Moi", isFriend: true },
            ],
            /*list: {
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
            },*/
        },
    ];
}

// TODO : ignore after this comment
// export async function createGroup(): Promise<Group> {
//     return {
//         id: 7,
//         value: "Placeholder 7",
//         position: 7,
//     };
// }

// export async function updateGroup(id: number, group: Group): Promise<Group> {
//     return {
//         id: 7,
//         value: "Placeholder 7",
//         position: 7,
//     };
// }

// export async function deleteGroup(id: number): Promise<boolean> {
//     return true;
// }
