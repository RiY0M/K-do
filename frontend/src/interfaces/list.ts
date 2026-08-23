import { Item } from "./item";
import { User } from "./user";

export interface List {
    id: number;
    label: string;
    description: string;
    position: number;
    uncheckedItems?: Item[];
    checkedItems?: Item[];
    friends?: User[];
}
