import { Link } from "./Link";
import { User } from "./User";

export interface Kdo {
    id: string;
    label: string;
    isChecked?: boolean;
    position: number;
    authorId?: string;
    takenBy?: User[];
    links?: Link[];
}

// Partial update of a Kdo kept in a list's state (see useKdos)
export type KdoUpdate = Partial<Kdo> & Pick<Kdo, "id">;
