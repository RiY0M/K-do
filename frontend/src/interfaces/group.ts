import { User } from "./user";
import { List } from "./list";

export interface Group {
    id: number;
    label: string;
    friends: User[];
    list: List;
    position: number;
}
