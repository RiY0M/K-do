import { Item } from "../interfaces/item"

export async function getMyUncheckedItems(): Promise<Item[]> {
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

export async function getMyCheckedItems(): Promise<Item[]> {
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

export async function createItem(): Promise<Item> {
    return {
        id: 7,
        value: "Placeholder 7",
        position: 7,
    };
}

export async function updateItem(id: number, item: Item): Promise<Item> {
    return {
        id: 7,
        value: "Placeholder 7",
        position: 7,
    };
}

export async function deleteItem(id: number): Promise<boolean> {
    return true;
}
