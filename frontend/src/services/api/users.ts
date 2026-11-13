import { getFetch, patchFetch } from "./fetch";
import { AccountInfo, AccountUpdate, NotificationSettings, UpdatedAccount } from "../../interfaces/AccountInfo";

const baseEndpoint = "/user";

export async function getUsername(userId: string): Promise<string> {
    const { name } = await getFetch<{ name: string }>(`${baseEndpoint}/getUsername/${userId}`);
    return name;
}

export async function getMyAccount(): Promise<AccountInfo> {
    return await getFetch<AccountInfo>(`${baseEndpoint}/me`);
}

// Changing the e-mail or the password e-mails the previous address a link to
// undo it, and logs out the other sessions (this one gets a new token)
export async function updateMyAccount(update: AccountUpdate): Promise<UpdatedAccount> {
    return await patchFetch<UpdatedAccount>(`${baseEndpoint}/me`, {
        body: JSON.stringify(update),
    });
}

// Which changes on friends' lists show up as news on the home page
export async function updateMyNotifications(changes: Partial<NotificationSettings>): Promise<NotificationSettings> {
    return await patchFetch<NotificationSettings>(`${baseEndpoint}/me/notifications`, {
        body: JSON.stringify(changes),
    });
}
