import { User } from "../interfaces/user";
import { postFetch } from "./fetch";
import { saveSession, clearSession } from "./authStorage";

interface AuthPayload {
  name: string;
  email?: string;
  password: string;
}

export async function login(payload: AuthPayload): Promise<User> {
  const user = await postFetch("/auth/login", {
    body: JSON.stringify(payload),
  });
  if (user) saveSession(user);
  return user;
}

export async function register(payload: AuthPayload): Promise<User> {
  const user = await postFetch("/auth/register", {
    body: JSON.stringify(payload),
  });
  if (user) saveSession(user);
  return user;
}

export function logout(): void {
  clearSession();
}
