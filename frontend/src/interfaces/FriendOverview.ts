import { User } from "./User";

// What changed on a friend's list since I last opened it (kinds turned off
// on the account page are always 0)
export interface FriendNews {
    added: number;
    edited: number;
    deleted: number;
    taken: number;
}

// A friend, as listed on the home page (GET /friend/friends)
export interface FriendOverview extends User {
    news: FriendNews;
    // The gifts of their list I took
    takenByMe: { id: string; label: string }[];
}
