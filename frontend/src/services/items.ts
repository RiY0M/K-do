import { Item } from "../interfaces/item"

export async function createItem(listId: number): Promise<Item> {
    // return await postFetch("/item/create", {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 7,
        value: "Placeholder 7",
        position: 7,
    };
}

export async function updateItem(id: number, item: Item): Promise<Item> {
    // return await putFetch("/item/update", {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 7,
        value: "Placeholder 7",
        position: 7,
    };
}

export async function checkItem(id: number): Promise<Item> {
    // return await patchFetch("/item/check", {
    //     body: JSON.stringify(payload),
    // });
    return {
        id: 7,
        value: "Placeholder 7",
        position: 7,
    };
}

export async function deleteItem(id: number): Promise<boolean> {
    // return await deleteFetch("/item", {
    //     body: JSON.stringify(payload),
    // });
    return true;
}
