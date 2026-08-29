import { User } from "./User";

export interface Kdo {
    id: number;
    label: string;
    isChecked?: boolean;
    position: number;
    authorId?: string;
    takenBy?: User[];
}
