import { Kdo } from "./Kdo";
import { User } from "./User";

export interface List {
    id: string;
    label: string;
    description: string;
    position: number;
    uncheckedKdos?: Kdo[];
    checkedKdos?: Kdo[];
    friends?: User[];
}
