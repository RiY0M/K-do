import { getFetch } from "./fetch";

const baseEndpoint = "/user";

export async function getUsername(userId: string): Promise<string> {
    const { name } = await getFetch<{ name: string }>(`${baseEndpoint}/getUsername/${userId}`);
    return name;
}
