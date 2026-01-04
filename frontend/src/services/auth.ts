import { postFetch } from "./fetch";

interface AuthPayload {
  name: string;
  email?: string;
  password: string;
}

export async function login(payload: AuthPayload) {
  return await postFetch("/auth/login", {
    body: JSON.stringify(payload),
  });
}

export async function register(payload: AuthPayload) {
  return await postFetch("/auth/register", {
    body: JSON.stringify(payload),
  });
}
