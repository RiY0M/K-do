import { Item } from "../interfaces/item"

export async function getUncheckedItemsByUserId(id: number): Promise<Item[]> {
    return [
        {
            id: 0,
            value: "Placeholder 0",
            position: 1,
        },
        {
            id: 1,
            value: "Placeholder 1",
            position: 2,
        },
        {
            id: 2,
            value: "Placeholder 2",
            position: 3,
        },
    ];
}

export async function getCheckedItemsByUserId(id: number): Promise<Item[]> {
    return [
        {
            id: 3,
            value: "Placeholder 4",
            position: 4,
            isChecked: true,
        },
        {
            id: 4,
            value: "Placeholder 5",
            position: 5,
            isChecked: true,
        },
        {
            id: 5,
            value: "Placeholder 6",
            position: 6,
            isChecked: true,
        },
    ];
}
