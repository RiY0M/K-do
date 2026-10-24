import { User } from "./User";

// A friend request (PENDING) or a friendship (ACCEPTED). `user` is always the
// other person, whoever sent the request.
export interface Friendship {
    id: string;
    user: User;
    status: "PENDING" | "ACCEPTED";
    createdAt: string;
}

export interface FriendRequests {
    received: Friendship[];
    sent: Friendship[];
}
