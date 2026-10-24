import { User } from "./User";

export interface Invitation {
    id: string;
    inviter: User;
    list: {
        id: string;
        label: string;
    };
    expiresAt: string;
}
