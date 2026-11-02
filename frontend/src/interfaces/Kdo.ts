import { Link } from "./Link";
import { User } from "./User";

export interface Kdo {
    id: string;
    label: string;
    isChecked?: boolean;
    position: number;
    authorId?: string;
    takenBy?: User[];
    // Who created it: sent on every item of a friend's list, never on mine
    // (authorId only means "editable by me")
    author?: User;
    links?: Link[];
}

// Partial update of a Kdo kept in a list's state (see useKdos)
export type KdoUpdate = Partial<Kdo> & Pick<Kdo, "id">;
