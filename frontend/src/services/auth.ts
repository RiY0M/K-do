import { User } from "../interfaces/user";
import { postFetch } from "./fetch";

interface AuthPayload {
  name: string;
  email?: string;
  password: string;
}

export async function login(payload: AuthPayload): Promise<User> {
  return await postFetch("/auth/login", {
    body: JSON.stringify(payload),
  });
}

export async function register(payload: AuthPayload): Promise<User> {
  return await postFetch("/auth/register", {
    body: JSON.stringify(payload),
  });
}
