import { User } from "../../interfaces/User";
import { postFetch } from "./fetch";
import { AuthPayload } from "../../interfaces/AuthPayload";

const baseEndpoint = "/auth";

export async function login(payload: AuthPayload): Promise<User> {
  const user = await postFetch(`${baseEndpoint}/login`, {
    body: JSON.stringify(payload),
  });
  return user;
}

export async function register(payload: AuthPayload): Promise<User> {
  const user = await postFetch(`${baseEndpoint}/register`, {
    body: JSON.stringify(payload),
  });
  return user;
}
