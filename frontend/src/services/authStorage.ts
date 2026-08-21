import { AuthPayload } from "../interfaces/AuthPayload";
import { User } from "../interfaces/user";
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
  return getToken() !== null;
}

export async function loginAndSaveSession(credentials: AuthPayload, fallbackEndpoint: string = "/") {
  const user = await login(credentials);
  saveSession(user);
  navigation.navigate(fallbackEndpoint);
}

export async function registerAndSaveSession(credentials: AuthPayload, fallbackEndpoint: string = "/") {
  const user = await register(credentials);
  saveSession(user);
  navigation.navigate(fallbackEndpoint);
}

export function logout(): void {
  clearSession();
  navigation.navigate('/login');
}
