import { AuthPayload } from "../interfaces/AuthPayload";
import { User } from "../interfaces/User";
import { login, register } from "./api/auth";

const TOKEN_KEY = "kdo_token";
const USER_KEY = "kdo_user";

export function saveSession(user: User): void {
  if (!user.token) return;
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null && getCurrentUser() !== null;
}

// Full page loads (rather than the Navigation API, which isn't available in
// every browser) so that App re-reads the session and shows the right routes.
export async function loginAndSaveSession(credentials: AuthPayload, redirectUrl: string = "/") {
  const user = await login(credentials);
  saveSession(user);
  window.location.assign(redirectUrl);
}

export async function registerAndSaveSession(credentials: AuthPayload, redirectUrl: string = "/") {
  const user = await register(credentials);
  saveSession(user);
  window.location.assign(redirectUrl);
}

export function logout(): void {
  clearSession();
  window.location.assign("/login");
}
