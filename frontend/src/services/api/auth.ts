import { User } from "../../interfaces/User";
import { postFetch } from "./fetch";
import { AuthPayload } from "../../interfaces/AuthPayload";

const baseEndpoint = "/auth";

export async function login(payload: AuthPayload): Promise<User> {
  const user = await postFetch<User>(`${baseEndpoint}/login`, {
    body: JSON.stringify(payload),
  });
  return user;
}

export async function register(payload: AuthPayload): Promise<User> {
  const user = await postFetch<User>(`${baseEndpoint}/register`, {
    body: JSON.stringify(payload),
  });
  return user;
}

// Sends a reset link to the e-mail of this account (username or e-mail).
// Returns the masked address, e.g. "y***t@gmail.com".
export async function forgotPassword(identifier: string): Promise<{ email: string }> {
  return await postFetch(`${baseEndpoint}/forgotPassword`, {
    body: JSON.stringify({ identifier: identifier }),
  });
}

export async function resetPassword(token: string, password: string): Promise<{ success: boolean }> {
  return await postFetch(`${baseEndpoint}/resetPassword`, {
    body: JSON.stringify({ token: token, password: password }),
  });
}
