import { User } from "../../interfaces/user";
import { postFetch } from "./fetch";
import { AuthPayload } from "../../interfaces/AuthPayload";

export async function login(payload: AuthPayload): Promise<User> {
  const user = await postFetch("/auth/login", {
    body: JSON.stringify(payload),
  });
  return user;
}

export async function register(payload: AuthPayload): Promise<User> {
  const user = await postFetch("/auth/register", {
    body: JSON.stringify(payload),
  });
  return user;
}
