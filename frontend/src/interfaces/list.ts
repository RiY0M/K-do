import { Item } from "./item";

export interface List {
    id: number;
    description: string;
    uncheckedItems: Item[];
    checkedItems: Item[];
}
